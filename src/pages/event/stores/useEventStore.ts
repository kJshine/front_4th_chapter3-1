import { create } from 'zustand';

import { Event } from '@/types';

type TimeErrorRecord = Record<'startTimeError' | 'endTimeError', string | null>;

interface EventStore {
  title: Event['title'];
  date: Event['date'];
  startTime: Event['startTime'];
  endTime: Event['endTime'];
  description: Event['description'];
  location: Event['location'];
  category: Event['category'];
  repeatType: Event['repeat']['type'];
  repeatInterval: Event['repeat']['interval'];
  repeatEndDate: Event['repeat']['endDate'];
  notificationTime: Event['notificationTime'];
  isRepeating: boolean;
  editingEvent: Event | null;
  startTimeError: string | null;
  endTimeError: string | null;
  timeError: TimeErrorRecord;

  setTitle: (title: Event['title']) => void;
  setDate: (date: Event['date']) => void;
  setStartTime: (startTime: Event['startTime']) => void;
  setEndTime: (endTime: Event['endTime']) => void;
  setDescription: (description: Event['description']) => void;
  setLocation: (location: Event['location']) => void;
  setCategory: (category: Event['category']) => void;
  setRepeatType: (repeatType: Event['repeat']['type']) => void;
  setRepeatInterval: (repeatInterval: Event['repeat']['interval']) => void;
  setRepeatEndDate: (repeatEndDate: Event['repeat']['endDate']) => void;
  setNotificationTime: (notificationTime: Event['notificationTime']) => void;
  setIsRepeating: (isRepeating: boolean) => void;
  setEditingEvent: (editingEvent: Event | null) => void;
  setTimeError: (timeError: TimeErrorRecord) => void;
}

export const useEventStore = create<EventStore>((set) => ({
  title: '',
  date: '',
  startTime: '',
  endTime: '',
  description: '',
  location: '',
  category: '',
  repeatType: 'none',
  repeatInterval: 1,
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
  setTitle: (title) => set({ title }),
  setDate: (date) => set({ date }),
  setStartTime: (startTime) => set({ startTime }),
  setEndTime: (endTime) => set({ endTime }),
  setDescription: (description) => set({ description }),
  setLocation: (location) => set({ location }),
  setCategory: (category) => set({ category }),
  setRepeatType: (repeatType) => set({ repeatType }),
  setRepeatInterval: (repeatInterval) => set({ repeatInterval }),
  setRepeatEndDate: (repeatEndDate) => set({ repeatEndDate }),
  setNotificationTime: (notificationTime) => set({ notificationTime }),
  setIsRepeating: (isRepeating) => set({ isRepeating }),
  setEditingEvent: (editingEvent) => set({ editingEvent }),
  setTimeError: (timeError) => set({ timeError }),
}));
