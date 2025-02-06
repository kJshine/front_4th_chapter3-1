import { act, renderHook } from '@testing-library/react';

import { FILTERED_EVENTS } from '../../__mocks__/response/mockEvents.ts';
import { useNotifications } from '../../hooks/useNotifications.ts';
import { createNotificationMessage } from '../../utils/notificationUtils.ts';

describe('useNotifications', () => {
  const testData = {
    currentTime: new Date('2024-07-01T08:50:00'),
    checkInterval: 1000,
  };

  const expectedNotification = {
    id: FILTERED_EVENTS[0].id,
    message: createNotificationMessage(FILTERED_EVENTS[0]),
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(testData.currentTime);
  });

  afterEach(() => {
    // 각 테스트 후 타이머 초기화
    vi.useRealTimers();
  });

  it('초기 상태에서는 알림이 없어야 한다', () => {
    const { result } = renderHook(() => useNotifications(FILTERED_EVENTS));
    expect(result.current.notifications).toEqual([]);
  });

  it('지정된 시간이 된 경우 알림이 새롭게 생성되어 추가된다', () => {
    const { result } = renderHook(() => useNotifications(FILTERED_EVENTS));
    expect(result.current.notifications).toEqual([]);

    act(() => vi.advanceTimersByTime(testData.checkInterval));
    expect(result.current.notifications).toEqual([expectedNotification]);
  });

  it('index를 기준으로 알림을 적절하게 제거할 수 있다', () => {
    const { result } = renderHook(() => useNotifications(FILTERED_EVENTS));
    expect(result.current.notifications).toEqual([]);

    act(() => vi.advanceTimersByTime(testData.checkInterval));
    expect(result.current.notifications).toEqual([expectedNotification]);

    act(() => result.current.removeNotification(0));
    expect(result.current.notifications).toEqual([]);
  });

  it('이미 알림이 발생한 이벤트에 대해서는 중복 알림이 발생하지 않아야 한다', () => {
    const { result } = renderHook(() => useNotifications(FILTERED_EVENTS));
    expect(result.current.notifications).toEqual([]);

    act(() => vi.advanceTimersByTime(testData.checkInterval));
    expect(result.current.notifications).toEqual([expectedNotification]);

    act(() => vi.advanceTimersByTime(testData.checkInterval));
    expect(result.current.notifications).toEqual([expectedNotification]);
  });
});
