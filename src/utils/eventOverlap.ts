import { Event, EventForm } from '../types';

/**
 * 주어진 날짜의 문자열과 시간의 문자열을 Date 객체로 변환한다
 * @param date "YYYY-MM-DD" 형식의 문자열
 * @param time "HH:mm" 형식의 문자열
 * @returns Date 객체
 */
export function parseDateTime(date: string, time: string) {
  return new Date(`${date}T${time}`);
}

/**
 * Event or EventForm 객체에서 날짜와 시간을 가져와서 시작/종료 시간을 가진 객체로 변환합니다.
 * @param {Event | EventForm} param Event or EventForm 객체
 * @param param.date 'YYYY-MM-DD' 형식의 문자열
 * @param param.startTime 'HH:mm' 형식의 문자열
 * @param param.endTime 'HH:mm' 형식의 문자열
 * @returns
 */
export function convertEventToDateRange({ date, startTime, endTime }: Event | EventForm) {
  return {
    start: parseDateTime(date, startTime),
    end: parseDateTime(date, endTime),
  };
}

/**
 * 이벤트의 시간대가 겹치는지 아닌지에 대한 boolean값을 반환합니다.
 * @param event1 비교하려는 이벤트1
 * @param event2 비교하려는 이벤트2
 * @returns 이벤트1과 이벤트2가 겹친다면 true, 아니라면 false
 */
export function isOverlapping(event1: Event | EventForm, event2: Event | EventForm) {
  const { start: start1, end: end1 } = convertEventToDateRange(event1);
  const { start: start2, end: end2 } = convertEventToDateRange(event2);

  return start1 < end2 && start2 < end1;
}

/**
 * 이벤트 배열에서 비교하려는 이벤트가 겹친다면 겹치는 이벤트 객체 배열을 반환합니다. 없다면 빈 배열을 반환합니다.
 * @param newEvent 새 이벤트
 * @param events 비교하려는 이벤트 객체 배열
 * @returns 이벤트 객체 배열
 */
export function findOverlappingEvents(newEvent: Event | EventForm, events: Event[]) {
  return events.filter(
    (event) => event.id !== (newEvent as Event).id && isOverlapping(event, newEvent)
  );
}
