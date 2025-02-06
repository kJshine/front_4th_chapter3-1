import { Event, NotificationType } from '../types';

const 초 = 1000;
const 분 = 초 * 60;

export function getUpcomingEvents(events: Event[], now: Date, notifiedEvents: string[]) {
  return events.filter((event) => {
    const eventStart = new Date(`${event.date}T${event.startTime}`);
    const timeDiff = (eventStart.getTime() - now.getTime()) / 분;
    return timeDiff > 0 && timeDiff <= event.notificationTime && !notifiedEvents.includes(event.id);
  });
}

export function createNotificationMessage({ notificationTime, title }: Event) {
  return `${notificationTime}분 후 ${title} 일정이 시작됩니다.`;
}

/**
 * 알림 목록에서 특정 알림을 제거합니다.
 * @param notifications 알림 목록
 * @param indexToRemove 제거할 알림의 인덱스
 * @returns 제거된 알림 목록
 */
export function removeNotificationByIndex(
  notifications: NotificationType[],
  indexToRemove: number
): NotificationType[] {
  return notifications.filter((_, index) => index !== indexToRemove);
}
