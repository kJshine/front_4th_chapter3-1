import { Event, RepeatType } from '../../types';
import {
  fillZero,
  formatDate,
  formatMonth,
  formatWeek,
  getDaysInMonth,
  getEventsForDay,
  getWeekDates,
  getWeeksAtMonth,
  isDateInRange,
} from '../../utils/dateUtils';

describe('getDaysInMonth', () => {
  it('1월은 31일 수를 반환한다', () => {
    expect(getDaysInMonth(2025, 1)).toBe(31);
  });

  it('4월은 30일 일수를 반환한다', () => {
    expect(getDaysInMonth(2025, 4)).toBe(30);
  });

  it('윤년의 2월에 대해 29일을 반환한다', () => {
    expect(getDaysInMonth(2000, 2)).toBe(29);
  });

  it('평년의 2월에 대해 28일을 반환한다', () => {
    expect(getDaysInMonth(2025, 2)).toBe(28);
  });

  it('유효하지 않은 월에 대해 적절히 처리한다', () => {
    expect(getDaysInMonth(2025, -1)).toBe(30); // 2024-11-30
    expect(getDaysInMonth(2025, 0)).toBe(31); // 2024-12-31
    expect(getDaysInMonth(2025, 13)).toBe(31); // 2026-01-31
  });
});

describe('getWeekDates', () => {
  it('주중의 날짜(수요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const wednesday = new Date('2025-02-05'); // 수요일
    const expectedDates = [
      new Date('2025-02-02'),
      new Date('2025-02-03'),
      new Date('2025-02-04'),
      new Date('2025-02-05'),
      new Date('2025-02-06'),
      new Date('2025-02-07'),
      new Date('2025-02-08'),
    ];

    const result = getWeekDates(wednesday);
    expect(result).toEqual(expectedDates);
  });

  it('주의 시작(월요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const monday = new Date('2025-02-03'); // 월요일
    const expectedDates = [
      new Date('2025-02-02'),
      new Date('2025-02-03'),
      new Date('2025-02-04'),
      new Date('2025-02-05'),
      new Date('2025-02-06'),
      new Date('2025-02-07'),
      new Date('2025-02-08'),
    ];

    const result = getWeekDates(monday);
    expect(result).toEqual(expectedDates);
  });

  it('주의 끝(일요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const sunday = new Date('2025-02-09'); // 일요일
    const expectedDates = [
      new Date('2025-02-09'),
      new Date('2025-02-10'),
      new Date('2025-02-11'),
      new Date('2025-02-12'),
      new Date('2025-02-13'),
      new Date('2025-02-14'),
      new Date('2025-02-15'),
    ];

    const result = getWeekDates(sunday);
    expect(result).toEqual(expectedDates);
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연말)', () => {
    const lstDayOfYear = new Date('2024-12-31');
    const expectedDates = [
      new Date('2024-12-29'),
      new Date('2024-12-30'),
      new Date('2024-12-31'),
      new Date('2025-01-01'),
      new Date('2025-01-02'),
      new Date('2025-01-03'),
      new Date('2025-01-04'),
    ];

    const result = getWeekDates(lstDayOfYear);
    expect(result).toEqual(expectedDates);
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연초)', () => {
    const newYearsDay = new Date('2025-01-01');
    const expectedDates = [
      new Date('2024-12-29'),
      new Date('2024-12-30'),
      new Date('2024-12-31'),
      new Date('2025-01-01'),
      new Date('2025-01-02'),
      new Date('2025-01-03'),
      new Date('2025-01-04'),
    ];

    const result = getWeekDates(newYearsDay);
    expect(result).toEqual(expectedDates);
  });

  it('윤년의 2월 29일을 포함한 주를 올바르게 처리한다', () => {
    const leapYearFebTwentyNinth = new Date('2024-02-29');
    const expectedDates = [
      new Date('2024-02-25'),
      new Date('2024-02-26'),
      new Date('2024-02-27'),
      new Date('2024-02-28'),
      new Date('2024-02-29'),
      new Date('2024-03-01'),
      new Date('2024-03-02'),
    ];

    const result = getWeekDates(leapYearFebTwentyNinth);
    expect(result).toEqual(expectedDates);
  });

  it('월의 마지막 날짜를 포함한 주를 올바르게 처리한다', () => {
    const lastDayOfMonth = new Date('2025-01-31');
    const expectedDates = [
      new Date('2025-01-26'),
      new Date('2025-01-27'),
      new Date('2025-01-28'),
      new Date('2025-01-29'),
      new Date('2025-01-30'),
      new Date('2025-01-31'),
      new Date('2025-02-01'),
    ];

    const result = getWeekDates(lastDayOfMonth);
    expect(result).toEqual(expectedDates);
  });
});

describe('getWeeksAtMonth', () => {
  it('2024년 7월 1일의 올바른 주 정보를 반환해야 한다', () => {
    const result = getWeeksAtMonth(new Date('2024-07-01'));
    const expectedWeeks = [
      [null, 1, 2, 3, 4, 5, 6],
      [7, 8, 9, 10, 11, 12, 13],
      [14, 15, 16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25, 26, 27],
      [28, 29, 30, 31, null, null, null],
    ];

    expect(result).toEqual(expectedWeeks);
  });

  it('2024년 3월(6주가 되는 달)의 올바른 주 정보를 반환해야 한다', () => {
    const result = getWeeksAtMonth(new Date('2024-03-01'));
    const expectedWeeks = [
      [null, null, null, null, null, 1, 2],
      [3, 4, 5, 6, 7, 8, 9],
      [10, 11, 12, 13, 14, 15, 16],
      [17, 18, 19, 20, 21, 22, 23],
      [24, 25, 26, 27, 28, 29, 30],
      [31, null, null, null, null, null, null],
    ];

    expect(result).toEqual(expectedWeeks);
  });

  it('윤년 2024년 2월의 올바른 주 정보를 반환해야 한다', () => {
    const result = getWeeksAtMonth(new Date('2024-02-01'));
    const expectedWeeks = [
      [null, null, null, null, 1, 2, 3],
      [4, 5, 6, 7, 8, 9, 10],
      [11, 12, 13, 14, 15, 16, 17],
      [18, 19, 20, 21, 22, 23, 24],
      [25, 26, 27, 28, 29, null, null],
    ];

    expect(result).toEqual(expectedWeeks);
  });

  it('평년 2025년 2월의 올바른 주 정보를 반환해야 한다', () => {
    const result = getWeeksAtMonth(new Date('2025-02-01'));
    const expectedWeeks = [
      [null, null, null, null, null, null, 1],
      [2, 3, 4, 5, 6, 7, 8],
      [9, 10, 11, 12, 13, 14, 15],
      [16, 17, 18, 19, 20, 21, 22],
      [23, 24, 25, 26, 27, 28, null],
    ];

    expect(result).toEqual(expectedWeeks);
  });
});

describe('getEventsForDay', () => {
  const singleEvents: Event[] = [
    {
      id: '2b7545a6-ebee-426c-b906-2329bc8d62bd',
      title: '팀 회의1',
      date: '2025-02-01',
      startTime: '10:00',
      endTime: '11:00',
      description: '주간 팀 미팅',
      location: '회의실 A',
      category: '업무',
      repeat: {
        type: 'none' as RepeatType,
        interval: 0,
      },
      notificationTime: 1,
    },
  ];

  const multipleEvents: Event[] = [
    ...singleEvents,
    {
      id: '2b7545a6-ebee-426c-b906-2329bc8d62bf',
      title: '팀 회의2',
      date: '2025-02-01',
      startTime: '14:00',
      endTime: '15:00',
      description: '주간 팀 미팅',
      location: '회의실 A',
      category: '업무',
      repeat: {
        type: 'none' as RepeatType,
        interval: 0,
      },
      notificationTime: 1,
    },
  ];

  const mixedEvents: Event[] = [
    ...multipleEvents,
    {
      id: '2b7545a6-ebee-426c-b906-2329bc8d62be',
      title: '운동',
      date: '2025-02-02',
      startTime: '14:00',
      endTime: '15:00',
      description: '운동하자',
      location: '헬스장',
      category: '개인',
      repeat: {
        type: 'none' as RepeatType,
        interval: 0,
      },
      notificationTime: 1,
    },
  ];

  it('특정 날짜(1일)에 해당하는 이벤트만 정확히 반환한다', () => {
    expect(getEventsForDay(singleEvents, 1)).toEqual(singleEvents);
  });

  it('특정 날짜(1일)에 해당하는 이벤트를 모두 반환한다', () => {
    expect(getEventsForDay(multipleEvents, 1)).toEqual(multipleEvents);
  });

  it('여러 이벤트가 있어도 특정 날짜(2일)에 해당하는 이벤트만 반환한다', () => {
    expect(getEventsForDay(mixedEvents, 2)).toEqual([
      {
        id: '2b7545a6-ebee-426c-b906-2329bc8d62be',
        title: '운동',
        date: '2025-02-02',
        startTime: '14:00',
        endTime: '15:00',
        description: '운동하자',
        location: '헬스장',
        category: '개인',
        repeat: {
          type: 'none' as RepeatType,
          interval: 0,
        },
        notificationTime: 1,
      },
    ]);
  });

  it('해당 날짜에 이벤트가 없을 경우 빈 배열을 반환한다', () => {
    expect(getEventsForDay(singleEvents, 3)).toEqual([]);
  });

  it('이벤트가 없을 경우 빈 배열을 반환한다', () => {
    expect(getEventsForDay([], 1)).toEqual([]);
  });

  it('날짜가 -1일 경우 빈 배열을 반환한다', () => {
    expect(getEventsForDay(singleEvents, -1)).toEqual([]);
  });

  it('날짜가 0일 경우 빈 배열을 반환한다', () => {
    expect(getEventsForDay(singleEvents, 0)).toEqual([]);
  });

  it('날짜가 32일 이상인 경우 빈 배열을 반환한다', () => {
    expect(getEventsForDay(singleEvents, 32)).toEqual([]);
  });
});

describe('formatWeek', () => {
  it('월의 중간 날짜에 대해 올바른 주 정보를 반환한다', () => {
    expect(formatWeek(new Date('2025-02-12'))).toBe('2025년 2월 2주');
  });

  it('월의 첫 주에 대해 올바른 주 정보를 반환한다', () => {
    expect(formatWeek(new Date('2025-02-03'))).toBe('2025년 2월 1주');
  });

  it('월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    expect(formatWeek(new Date('2025-02-27'))).toBe('2025년 2월 4주');
  });

  it('월이 바뀌는 주에 대한 올바른 주 정보를 반환한다', () => {
    expect(formatWeek(new Date('2025-01-31'))).toBe('2025년 1월 5주');
    expect(formatWeek(new Date('2025-02-01'))).toBe('2025년 1월 5주');
  });

  it('1일이 어느 요일에 위치하는지에 따라 해당 월의 1주차 또는 이전 월의 마지막 주차로 계산된다', () => {
    const firstDayIsSunday = new Date('2025-06-01');
    const firstDayIsMonday = new Date('2025-09-01');
    const firstDayIsTuesDay = new Date('2025-04-01');
    const firstDayIsWednesDay = new Date('2025-10-01');
    const firstDayIsThursDay = new Date('2025-05-01');
    const firstDayIsFriday = new Date('2025-08-01');
    const firstDayIsSaturday = new Date('2025-02-01');

    // 해당 월의 1주차로 계산 (일~목)
    expect(formatWeek(firstDayIsSunday)).toBe('2025년 6월 1주');
    expect(formatWeek(firstDayIsMonday)).toBe('2025년 9월 1주');
    expect(formatWeek(firstDayIsTuesDay)).toBe('2025년 4월 1주');
    expect(formatWeek(firstDayIsWednesDay)).toBe('2025년 10월 1주');
    expect(formatWeek(firstDayIsThursDay)).toBe('2025년 5월 1주');

    // 이전 월의 마지막주차로 계산 (금,토)
    expect(formatWeek(firstDayIsFriday)).toBe('2025년 7월 5주');
    expect(formatWeek(firstDayIsSaturday)).toBe('2025년 1월 5주');
  });

  it('연도가 바뀌는 주에 대해 올바른 주 정보를 반환한다', () => {
    expect(formatWeek(new Date('2025-01-01'))).toBe('2025년 1월 1주');
  });

  it('윤년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    expect(formatWeek(new Date('2024-02-29'))).toBe('2024년 2월 5주');
  });

  it('평년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    expect(formatWeek(new Date('2025-02-28'))).toBe('2025년 2월 4주');
  });
});

describe('formatMonth', () => {
  it("2024년 7월 10일을 '2024년 7월'로 반환한다", () => {
    expect(formatMonth(new Date('2024-07-10'))).toBe('2024년 7월');
  });

  it('연도가 바뀌는 달을 올바르게 반환한다', () => {
    expect(formatMonth(new Date('2024-12-31'))).toBe('2024년 12월');
    expect(formatMonth(new Date('2025-01-01'))).toBe('2025년 1월');
  });
});

describe('isDateInRange', () => {
  const rangeStart = new Date('2024-07-01');
  const rangeEnd = new Date('2024-07-31');

  it('범위 내의 날짜 2024-07-10에 대해 true를 반환한다', () => {});

  it('범위의 시작일 2024-07-01에 대해 true를 반환한다', () => {});

  it('범위의 종료일 2024-07-31에 대해 true를 반환한다', () => {});

  it('범위 이전의 날짜 2024-06-30에 대해 false를 반환한다', () => {});

  it('범위 이후의 날짜 2024-08-01에 대해 false를 반환한다', () => {});

  it('시작일이 종료일보다 늦은 경우 모든 날짜에 대해 false를 반환한다', () => {});
});

describe('fillZero', () => {
  test("5를 2자리로 변환하면 '05'를 반환한다", () => {});

  test("10을 2자리로 변환하면 '10'을 반환한다", () => {});

  test("3을 3자리로 변환하면 '003'을 반환한다", () => {});

  test("100을 2자리로 변환하면 '100'을 반환한다", () => {});

  test("0을 2자리로 변환하면 '00'을 반환한다", () => {});

  test("1을 5자리로 변환하면 '00001'을 반환한다", () => {});

  test("소수점이 있는 3.14를 5자리로 변환하면 '03.14'를 반환한다", () => {});

  test('size 파라미터를 생략하면 기본값 2를 사용한다', () => {});

  test('value가 지정된 size보다 큰 자릿수를 가지면 원래 값을 그대로 반환한다', () => {});
});

describe('formatDate', () => {
  it('날짜를 YYYY-MM-DD 형식으로 포맷팅한다', () => {});

  it('day 파라미터가 제공되면 해당 일자로 포맷팅한다', () => {});

  it('월이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {});

  it('일이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {});
});
