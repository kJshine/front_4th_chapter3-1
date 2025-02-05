import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, within, waitFor } from '@testing-library/react';
import { UserEvent, userEvent } from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { ReactElement } from 'react';

import { setupMockHandlers } from '../__mocks__/handlersUtils';
import { SEARCH_EVENTS } from '../__mocks__/response/mockEvents';
import App from '../App';
import { Event } from '../types';
import { fillEventForm, mockEventFactory, performSearch, verifyEventInList } from './utils';

let user: UserEvent;

const renderApp = () => {
  return render(
    <ChakraProvider>
      <App />
    </ChakraProvider>
  );
};

beforeEach(() => {
  user = userEvent.setup();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('일정 CRUD 및 기본 기능', () => {
  it('입력한 새로운 일정 정보에 맞춰 모든 필드가 이벤트 리스트에 정확히 저장된다.', async () => {
    // ! HINT. event를 추가 제거하고 저장하는 로직을 잘 살펴보고, 만약 그대로 구현한다면 어떤 문제가 있을 지 고민해보세요.

    setupMockHandlers();
    renderApp();

    const newEvent = mockEventFactory({
      title: '이벤트 1',
      description: '기존 팀 미팅1',
      location: '회의실 A',
    });

    await fillEventForm(user, newEvent);
    await user.click(screen.getByRole('button', { name: '일정 추가' }));
    await verifyEventInList(newEvent);
  });

  it('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영된다', async () => {
    const mockEvent = mockEventFactory();

    setupMockHandlers([mockEvent]);
    renderApp();

    const eventList = screen.getByTestId('event-list');
    const editButton = await within(eventList).findByRole('button', { name: 'Edit event' });
    await user.click(editButton);

    const editEvent = mockEventFactory({
      title: '변경된 회의',
      startTime: '15:00',
      endTime: '16:00',
      description: '변경된 팀 미팅',
      location: '회의실 A',
    });

    await fillEventForm(user, editEvent);
    await user.click(screen.getByRole('button', { name: '일정 수정' }));
    await verifyEventInList(editEvent);
  });

  it('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {
    const mockEvent = mockEventFactory();
    setupMockHandlers([mockEvent]);
    renderApp();

    const eventList = screen.getByTestId('event-list');
    await waitFor(() => {
      expect(within(eventList).getByText(mockEvent.title)).toBeInTheDocument();
    });
    const deleteButton = await within(eventList).findByRole('button', { name: 'Delete event' });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(within(eventList).queryByText(mockEvent.title)).not.toBeInTheDocument();
    });
  });
});

describe('일정 뷰', () => {
  it('주별 뷰를 선택 후 해당 주에 일정이 없으면, 일정이 표시되지 않는다.', async () => {
    const mockEvent = mockEventFactory({
      date: '2025-03-05',
    });
    setupMockHandlers([mockEvent]);
    renderApp();

    const viewSelect = screen.getByRole('combobox', { name: /view/ });
    await user.selectOptions(viewSelect, 'Week');

    const weekView = screen.getByTestId('week-view');
    await waitFor(() => {
      expect(within(weekView).queryByText(mockEvent.title)).not.toBeInTheDocument();
    });
  });

  it('주별 뷰 선택 후 해당 일자에 일정이 존재한다면 해당 일정이 정확히 표시된다', async () => {
    const mockEvent = mockEventFactory();
    setupMockHandlers([mockEvent]);
    renderApp();

    const viewSelect = screen.getByRole('combobox', { name: /view/ });
    await user.selectOptions(viewSelect, 'Week');

    const weekView = screen.getByTestId('week-view');
    await waitFor(() => {
      expect(within(weekView).queryByText(mockEvent.title)).toBeInTheDocument();
    });
  });

  it('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {
    const mockEvent = mockEventFactory({
      date: '2025-03-05',
    });
    setupMockHandlers([mockEvent]);
    renderApp();

    const viewSelect = screen.getByRole('combobox', { name: /view/ });
    await user.selectOptions(viewSelect, 'Month');

    const monthView = screen.getByTestId('month-view');
    await waitFor(() => {
      expect(within(monthView).queryByText(mockEvent.title)).not.toBeInTheDocument();
    });
  });

  it('월별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
    const mockEvent = mockEventFactory();
    setupMockHandlers([mockEvent]);
    renderApp();

    const viewSelect = screen.getByRole('combobox', { name: /view/ });
    await user.selectOptions(viewSelect, 'Month');

    const monthView = screen.getByTestId('month-view');
    await waitFor(() => {
      expect(within(monthView).queryByText(mockEvent.title)).toBeInTheDocument();
    });
  });

  it('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', async () => {
    vi.setSystemTime(new Date('2024-01-01'));
    renderApp();

    const viewSelect = screen.getByRole('combobox', { name: /view/ });
    await user.selectOptions(viewSelect, 'Month');

    const monthView = screen.getByTestId('month-view');
    await waitFor(() => {
      expect(within(monthView).queryByText('신정')).toBeInTheDocument();
    });
  });
});

describe('검색 기능', () => {
  beforeEach(() => {
    setupMockHandlers(SEARCH_EVENTS);
    renderApp();
  });

  it('검색 결과가 없으면, "검색 결과가 없습니다."가 표시되어야 한다.', async () => {
    const resultEventList = await performSearch(user, '아무거나');
    await waitFor(() => {
      expect(within(resultEventList).getByText('검색 결과가 없습니다.')).toBeInTheDocument();
    });
  });

  it("'팀 회의'를 검색하면 해당 제목을 가진 일정이 리스트에 노출된다", async () => {
    const resultEventList = await performSearch(user, '팀 회의');
    await waitFor(() => {
      expect(within(resultEventList).getByText('팀 회의 1')).toBeInTheDocument();
      expect(within(resultEventList).getByText('팀 회의 2')).toBeInTheDocument();
    });
  });

  it('검색어를 지우면 모든 일정이 다시 표시되어야 한다', async () => {
    const resultEventList = await performSearch(user, '');
    await waitFor(() => {
      expect(within(resultEventList).getByText(SEARCH_EVENTS[0].title)).toBeInTheDocument();
      expect(within(resultEventList).getByText(SEARCH_EVENTS[1].title)).toBeInTheDocument();
      expect(within(resultEventList).getByText(SEARCH_EVENTS[2].title)).toBeInTheDocument();
    });
  });
});

describe('일정 충돌', () => {
  beforeEach(() => {
    setupMockHandlers(SEARCH_EVENTS);
    renderApp();
  });

  it('겹치는 시간에 새 일정을 추가할 때 경고가 표시된다', async () => {
    const mockEvent = mockEventFactory({
      title: '새로운 회의',
      startTime: '09:00',
      endTime: '10:00',
    });

    await fillEventForm(user, mockEvent);
    await user.click(screen.getByRole('button', { name: '일정 추가' }));
    await waitFor(() => {
      expect(screen.getByText('일정 겹침 경고')).toBeInTheDocument();
    });
  });

  it('기존 일정의 시간을 수정하여 충돌이 발생하면 경고가 노출된다', async () => {
    const resultEventList = await performSearch(user, '팀 회의 1');
    const editButton = within(resultEventList).getByRole('button', {
      name: 'Edit event',
    });
    await user.click(editButton);

    const editEvent: Event = {
      ...SEARCH_EVENTS[1],
      startTime: '09:00',
    };
    await fillEventForm(user, editEvent);
    await user.click(screen.getByRole('button', { name: '일정 수정' }));
    await waitFor(() => {
      expect(screen.getByText('일정 겹침 경고')).toBeInTheDocument();
    });
  });
});

it('notificationTime을 10으로 하면 지정 시간 10분 전 알람 텍스트가 노출된다', async () => {
  vi.setSystemTime(new Date('2025-02-05T09:50'));
  setupMockHandlers(SEARCH_EVENTS);
  renderApp();

  await waitFor(() => {
    expect(screen.getByText('10분 후 팀 회의 1 일정이 시작됩니다.')).toBeInTheDocument();
  });
});
