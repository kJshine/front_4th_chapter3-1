import { renderHook } from '@testing-library/react';

import { mockEventFactory, mockEventStoreFactory } from '../utils';

import { useEventStore } from '@/pages/event/stores';
import { useAddEventForm } from '@/pages/event/widgets/AddEventForm/hooks';
import { Event } from '@/types';

const mockToast = vi.fn();
const mockSaveEvent = vi.fn();
const mockSetIsOverlapDialogOpen = vi.fn();
const mockSetOverlappingEvents = vi.fn();
const mockResetForm = vi.fn();

vi.mock('@chakra-ui/react', () => ({
  useToast: () => mockToast,
}));

vi.mock('@/pages/event/stores', () => ({
  useEventStore: vi.fn(),
  useOverlapDialogStore: () => ({
    setIsOverlapDialogOpen: mockSetIsOverlapDialogOpen,
    setOverlappingEvents: mockSetOverlappingEvents,
  }),
}));

vi.mock('@/hooks/useEventForm', () => ({
  useEventForm: () => ({
    resetForm: mockResetForm,
  }),
}));

describe('useAddEventForm', () => {
  let mockEventStore: ReturnType<typeof mockEventStoreFactory>;
  let newEvent: Event;

  beforeEach(() => {
    vi.clearAllMocks();

    newEvent = mockEventFactory();

    mockEventStore = mockEventStoreFactory();
    (useEventStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockEventStore);
  });

  it('필수 입력값이 누락되었을 때 에러 토스트를 보여준다', async () => {
    mockEventStore.title = '';

    const { result } = renderHook(() =>
      useAddEventForm({
        events: [],
        saveEvent: mockSaveEvent,
      })
    );

    await result.current.addOrUpdateEvent();

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '필수 정보를 모두 입력해주세요.',
      })
    );
  });

  it('시간 정보가 올바르지 않으면 에러 토스트를 보여준다', async () => {
    mockEventStore.startTime = '11:00';
    mockEventStore.endTime = '10:00';
    mockEventStore.startTimeError = '시작 시간은 종료 시간보다 빨라야 합니다.';
    mockEventStore.endTimeError = '종료 시간은 시작 시간보다 늦어야 합니다.';

    (useEventStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockEventStore);

    const { result } = renderHook(() =>
      useAddEventForm({
        events: [],
        saveEvent: mockSaveEvent,
      })
    );

    await result.current.addOrUpdateEvent();

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '시간 설정을 확인해주세요.',
      })
    );
  });

  it('중복된 일정이 있으면 중복 다이얼로그를 보여준다', async () => {
    newEvent.date = '2025-02-06';
    newEvent.startTime = '10:00';
    newEvent.endTime = '11:00';

    const { result } = renderHook(() =>
      useAddEventForm({
        events: [newEvent],
        saveEvent: mockSaveEvent,
      })
    );

    await result.current.addOrUpdateEvent();

    expect(mockSetIsOverlapDialogOpen).toHaveBeenCalledWith(true);
    expect(mockSetOverlappingEvents).toHaveBeenCalledWith([newEvent]);
  });

  it('중복된 일정이 없으면 일정을 저장하고 폼을 초기화한다', async () => {
    const { result } = renderHook(() =>
      useAddEventForm({
        events: [newEvent],
        saveEvent: mockSaveEvent,
      })
    );

    await result.current.addOrUpdateEvent();

    expect(mockSaveEvent).toHaveBeenCalled();
    expect(mockSetIsOverlapDialogOpen).not.toHaveBeenCalled();
    expect(mockResetForm).toHaveBeenCalled();
  });
});
