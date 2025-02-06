import { ChangeEvent, useState } from 'react';

import { Event, RepeatType } from '../types';
import { getTimeErrorMessage } from '../utils/timeValidation';

import { useEventStore } from '@/pages/event/stores';

type TimeErrorRecord = Record<'startTimeError' | 'endTimeError', string | null>;

export const useEventForm = (initialEvent?: Event) => {
  const store = useEventStore();

  const handleStartTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newStartTime = e.target.value;
    store.setStartTime(newStartTime);
    store.setTimeError(getTimeErrorMessage(newStartTime, store.endTime));
  };

  const handleEndTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newEndTime = e.target.value;
    store.setEndTime(newEndTime);
    store.setTimeError(getTimeErrorMessage(store.startTime, newEndTime));
  };

  const resetForm = () => {
    store.setTitle('');
    store.setDate('');
    store.setStartTime('');
    store.setEndTime('');
    store.setDescription('');
    store.setLocation('');
    store.setCategory('');
    store.setIsRepeating(false);
    store.setRepeatType('none');
    store.setRepeatInterval(1);
    store.setRepeatEndDate('');
    store.setNotificationTime(10);
  };

  const editEvent = (event: Event) => {
    store.setEditingEvent(event);
    store.setTitle(event.title);
    store.setDate(event.date);
    store.setStartTime(event.startTime);
    store.setEndTime(event.endTime);
    store.setDescription(event.description);
    store.setLocation(event.location);
    store.setCategory(event.category);
    store.setIsRepeating(event.repeat.type !== 'none');
    store.setRepeatType(event.repeat.type);
    store.setRepeatInterval(event.repeat.interval);
    store.setRepeatEndDate(event.repeat.endDate || '');
    store.setNotificationTime(event.notificationTime);
  };

  return {
    handleStartTimeChange,
    handleEndTimeChange,
    resetForm,
    editEvent,
  };
};
