import { Event, RepeatType } from '../../types';
import {
  convertEventToDateRange,
  findOverlappingEvents,
  isOverlapping,
  parseDateTime,
} from '../../utils/eventOverlap';

describe('parseDateTime', () => {
  it('2024-07-01 14:30을 정확한 Date 객체로 변환한다', () => {
    const result = parseDateTime('2024-07-01', '14:30');

    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(6);
    expect(result.getDate()).toBe(1);
    expect(result.getHours()).toBe(14);
    expect(result.getMinutes()).toBe(30);
  });

  it('잘못된 날짜 형식에 대해 Invalid Date를 반환한다', () => {
    const result = parseDateTime('2024-07-35', '14:30');

    expect(result.getTime()).toBeNaN();
  });

  it('잘못된 시간 형식에 대해 Invalid Date를 반환한다', () => {
    const result = parseDateTime('2024-07-01', '24:30');

    expect(result.getTime()).toBeNaN();
  });

  it('날짜 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    const result = parseDateTime('', '14:30');

    expect(result.getTime()).toBeNaN();
  });

  it('시간 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    const result = parseDateTime('2024-07-01', '');

    expect(result.getTime()).toBeNaN();
  });
});

describe('convertEventToDateRange', () => {
  let mockEvent: Event;

  beforeEach(() => {
    mockEvent = {
      id: '2b7545a6-ebee-426c-b906-2329bc8d62bd',
      title: '팀 회의1',
      date: '2025-02-01',
      startTime: '13:30',
      endTime: '14:30',
      description: '주간 팀 미팅',
      location: '회의실 A',
      category: '업무',
      repeat: {
        type: 'none' as RepeatType,
        interval: 0,
      },
      notificationTime: 1,
    };
  });

  it('일반적인 이벤트를 올바른 시작 및 종료 시간을 가진 객체로 변환한다', () => {
    const result = convertEventToDateRange(mockEvent);

    expect(result).toEqual({
      start: parseDateTime(mockEvent.date, mockEvent.startTime),
      end: parseDateTime(mockEvent.date, mockEvent.endTime),
    });
  });

  it('잘못된 날짜 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    mockEvent.date = '2025-13-35';

    const result = convertEventToDateRange(mockEvent);

    expect(result.start.getTime()).toBeNaN();
    expect(result.end.getTime()).toBeNaN();
  });

  it('잘못된 시간 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    mockEvent.startTime = '25:30';
    mockEvent.endTime = '26:30';

    const result = convertEventToDateRange(mockEvent);

    expect(result.start.getTime()).toBeNaN();
    expect(result.end.getTime()).toBeNaN();
  });
});

describe('isOverlapping', () => {
  let mockEvent1: Event;
  let mockEvent2: Event;

  beforeEach(() => {
    mockEvent1 = {
      id: '1',
      title: '팀 회의1',
      date: '2025-02-01',
      startTime: '13:30',
      endTime: '14:30',
      description: '주간 팀 미팅',
      location: '회의실 A',
      category: '업무',
      repeat: {
        type: 'none' as RepeatType,
        interval: 0,
      },
      notificationTime: 1,
    };

    mockEvent2 = {
      id: '2',
      title: '팀 회의2',
      date: '2025-02-01',
      startTime: '',
      endTime: '',
      description: '주간 팀 미팅',
      location: '회의실 A',
      category: '업무',
      repeat: {
        type: 'none' as RepeatType,
        interval: 0,
      },
      notificationTime: 1,
    };
  });

  it('두 이벤트가 겹치는 경우 true를 반환한다', () => {
    mockEvent2.startTime = '14:00';
    mockEvent2.endTime = '15:00';

    const result = isOverlapping(mockEvent1, mockEvent2);

    expect(result).toBe(true);
  });

  it('두 이벤트가 겹치지 않는 경우 false를 반환한다', () => {
    mockEvent2.startTime = '14:30';
    mockEvent2.endTime = '15:30';

    const result = isOverlapping(mockEvent1, mockEvent2);

    expect(result).toBe(false);
  });
});

describe('findOverlappingEvents', () => {
  let newEvent: Event;
  const mockEvents: Event[] = [
    {
      id: '1',
      title: '이벤트1',
      date: '2025-02-01',
      startTime: '09:00',
      endTime: '10:00',
      description: '',
      location: '',
      category: '',
      repeat: {
        type: 'none',
        interval: 0,
      },
      notificationTime: 0,
    },
    {
      id: '2',
      title: '이벤트2',
      date: '2025-02-01',
      startTime: '10:30',
      endTime: '11:30',
      description: '',
      location: '',
      category: '',
      repeat: {
        type: 'none',
        interval: 0,
      },
      notificationTime: 0,
    },
    {
      id: '3',
      title: '이벤트3',
      date: '2025-02-01',
      startTime: '13:00',
      endTime: '14:00',
      description: '',
      location: '',
      category: '',
      repeat: {
        type: 'none',
        interval: 0,
      },
      notificationTime: 0,
    },
  ];

  beforeEach(() => {
    newEvent = {
      id: '4',
      title: '새 이벤트',
      date: '2025-02-01',
      startTime: '10:00',
      endTime: '11:00',
      description: '',
      location: '',
      category: '',
      repeat: {
        type: 'none',
        interval: 0,
      },
      notificationTime: 0,
    };
  });

  it('새 이벤트와 겹치는 모든 이벤트를 반환한다', () => {
    const result = findOverlappingEvents(newEvent, mockEvents);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('동일한 ID를 가진 이벤트는 제외한다', () => {
    newEvent.id = '2';
    newEvent.startTime = '10:30';
    newEvent.endTime = '11:30';
    const result = findOverlappingEvents(newEvent, mockEvents);

    expect(result).toHaveLength(0);
  });

  it('겹치는 이벤트가 없으면 빈 배열을 반환한다', () => {
    newEvent.startTime = '14:00';
    newEvent.endTime = '15:00';
    const result = findOverlappingEvents(newEvent, mockEvents);

    expect(result).toHaveLength(0);
  });
});
