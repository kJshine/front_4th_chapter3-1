import { ChangeEvent, useState } from 'react';

import { Event, RepeatType } from '../types';
import { getTimeErrorMessage } from '../utils/timeValidation';
import { useEventStore } from '@/pages/calendar/stores';

type TimeErrorRecord = Record<'startTimeError' | 'endTimeError', string | null>;

export const useEventForm = (initialEvent?: Event) => {
  // const [title, setTitle] = useState(initialEvent?.title || '');
  // const [date, setDate] = useState(initialEvent?.date || '');
  // const [startTime, setStartTime] = useState(initialEvent?.startTime || '');
  // const [endTime, setEndTime] = useState(initialEvent?.endTime || '');
  // const [description, setDescription] = useState(initialEvent?.description || '');
  // const [location, setLocation] = useState(initialEvent?.location || '');
  // const [category, setCategory] = useState(initialEvent?.category || '');
  // const [isRepeating, setIsRepeating] = useState(initialEvent?.repeat.type !== 'none');
  // const [repeatType, setRepeatType] = useState<RepeatType>(initialEvent?.repeat.type || 'none');
  // const [repeatInterval, setRepeatInterval] = useState(initialEvent?.repeat.interval || 1);
  // const [repeatEndDate, setRepeatEndDate] = useState(initialEvent?.repeat.endDate || '');
  // const [notificationTime, setNotificationTime] = useState(initialEvent?.notificationTime || 10);

  // const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // const [{ startTimeError, endTimeError }, setTimeError] = useState<TimeErrorRecord>({
  //   startTimeError: null,
  //   endTimeError: null,
  // });
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
    // title,
    // setTitle,
    // date,
    // setDate,
    // startTime,
    // setStartTime,
    // endTime,
    // setEndTime,
    // description,
    // setDescription,
    // location,
    // setLocation,
    // category,
    // setCategory,
    // isRepeating,
    // setIsRepeating,
    // repeatType,
    // setRepeatType,
    // repeatInterval,
    // setRepeatInterval,
    // repeatEndDate,
    // setRepeatEndDate,
    // notificationTime,
    // setNotificationTime,
    // startTimeError,
    // endTimeError,
    // editingEvent,
    // setEditingEvent,
    handleStartTimeChange,
    handleEndTimeChange,
    resetForm,
    editEvent,
  };
};
