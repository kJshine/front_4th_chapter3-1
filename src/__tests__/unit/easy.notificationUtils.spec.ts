import { MOCK_EVENTS } from '../../__mocks__/response/mockEvents';
import { Event } from '../../types';
import { createNotificationMessage, getUpcomingEvents } from '../../utils/notificationUtils';

describe('getUpcomingEvents', () => {
  it('알림 시간이 정확히 도래한 이벤트를 반환한다', () => {
    const mockDate = new Date('2024-10-15T08:50');
    const result = getUpcomingEvents(MOCK_EVENTS, mockDate, []);

    expect(result).toEqual(MOCK_EVENTS);
  });

  it('이미 알림이 간 이벤트는 제외한다', () => {
    const mockDate = new Date('2024-10-15T08:50');
    const result = getUpcomingEvents(MOCK_EVENTS, mockDate, ['1']);

    expect(result).toEqual([]);
  });

  it('알림 시간이 아직 도래하지 않은 이벤트는 반환하지 않는다', () => {
    const mockDate = new Date('2024-10-15T08:49');
    const result = getUpcomingEvents(MOCK_EVENTS, mockDate, []);

    expect(result).toEqual([]);
  });

  it('알림 시간이 지난 이벤트는 반환하지 않는다', () => {
    const mockDate = new Date('2024-10-15T09:01');
    const result = getUpcomingEvents(MOCK_EVENTS, mockDate, []);

    expect(result).toEqual([]);
  });
});

describe('createNotificationMessage', () => {
  it('올바른 알림 메시지를 생성해야 한다', () => {
    const msg = createNotificationMessage(MOCK_EVENTS[0]);

    expect(msg).toBe('10분 후 기존 회의 일정이 시작됩니다.');
  });
});
