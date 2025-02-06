import { screen, waitFor, within } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event';
import { vi } from 'vitest';

import { Event } from '../types';
import { fillZero } from '../utils/dateUtils';

import { EventStore } from '@/pages/event/stores';

export const assertDate = (date1: Date, date2: Date) => {
  expect(date1.toISOString()).toBe(date2.toISOString());
};

export const parseHM = (timestamp: number) => {
  const date = new Date(timestamp);
  const h = fillZero(date.getHours());
  const m = fillZero(date.getMinutes());
  return `${h}:${m}`;
};

export async function fillEventForm(user: UserEvent, event: Partial<Event>) {
  if (event.title) {
    const titleInput = screen.getByLabelText(/제목/);
    await user.clear(titleInput);
    await user.type(titleInput, event.title);
  }

  if (event.date) {
    const dateInput = screen.getByLabelText(/날짜/);
    await user.clear(dateInput);
    await user.type(dateInput, event.date);
  }

  if (event.startTime) {
    const startTimeInput = screen.getByLabelText(/시작 시간/);
    await user.clear(startTimeInput);
    await user.type(startTimeInput, event.startTime);
  }

  if (event.endTime) {
    const endTimeInput = screen.getByLabelText(/종료 시간/);
    await user.clear(endTimeInput);
    await user.type(endTimeInput, event.endTime);
  }

  if (event.description) {
    const descriptionInput = screen.getByLabelText(/설명/);
    await user.clear(descriptionInput);
    await user.type(descriptionInput, event.description);
  }

  if (event.location) {
    const locationInput = screen.getByLabelText(/위치/);
    await user.clear(locationInput);
    await user.type(locationInput, event.location);
  }

  if (event.category) {
    const categorySelect = screen.getByLabelText(/카테고리/);
    await user.selectOptions(categorySelect, event.category);
  }
}

export async function verifyEventInList(event: Partial<Event>) {
  const eventList = screen.getByTestId('event-list');

  await waitFor(() => {
    if (event.title) {
      expect(within(eventList).getByText(event.title)).toBeInTheDocument();
    }
    if (event.date) {
      expect(within(eventList).getByText(event.date)).toBeInTheDocument();
    }
    if (event.description) {
      expect(within(eventList).getByText(event.description)).toBeInTheDocument();
    }
    if (event.location) {
      expect(within(eventList).getByText(event.location)).toBeInTheDocument();
    }
    if (event.startTime && event.endTime) {
      expect(
        within(eventList).getByText(`${event.startTime} - ${event.endTime}`)
      ).toBeInTheDocument();
    }
  });
}

export const mockEventFactory = (overrides: Partial<Event> = {}): Event => ({
  id: '1',
  title: '기존 회의',
  date: '2025-02-05',
  startTime: '09:00',
  endTime: '10:00',
  description: '기존 팀 미팅',
  location: '회의실 B',
  category: '업무',
  repeat: { type: 'none', interval: 0 },
  notificationTime: 10,
  ...overrides,
});

export async function performSearch(user: UserEvent, searchTerm: string) {
  const searchInput = screen.getByLabelText(/일정 검색/);
  if (searchTerm === '') {
    await user.clear(searchInput);
  } else {
    await user.type(searchInput, searchTerm);
  }
  return screen.getByTestId('event-list');
}

export const mockEventStoreFactory = (overrides: Partial<EventStore> = {}): EventStore => ({
  title: '테스트 1',
  date: '2025-02-06',
  startTime: '10:00',
  endTime: '11:00',
  description: '테스트 설명',
  location: '테스트 위치',
  category: '테스트 카테고리',
  repeatType: 'none',
  repeatInterval: 0,
  repeatEndDate: '',
  notificationTime: 10,
  isRepeating: false,
  editingEvent: null,
  startTimeError: null,
  endTimeError: null,
  timeError: {
    startTimeError: null,
    endTimeError: null,
  },
  setTitle: vi.fn(),
  setDate: vi.fn(),
  setStartTime: vi.fn(),
  setEndTime: vi.fn(),
  setDescription: vi.fn(),
  setLocation: vi.fn(),
  setCategory: vi.fn(),
  setRepeatType: vi.fn(),
  setRepeatInterval: vi.fn(),
  setRepeatEndDate: vi.fn(),
  setNotificationTime: vi.fn(),
  setIsRepeating: vi.fn(),
  setEditingEvent: vi.fn(),
  setTimeError: vi.fn(),
  ...overrides,
});
