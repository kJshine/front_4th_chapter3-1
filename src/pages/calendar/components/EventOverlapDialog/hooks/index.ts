import { useRef } from 'react';

import { useEventStore, useOverlapDialogStore } from '@/pages/calendar/stores';
import { Event, EventForm } from '@/types';

export const useEventOverlapDialog = () => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const eventStore = useEventStore();

  const { setIsOverlapDialogOpen } = useOverlapDialogStore();

  const createEventData = (): Event | EventForm => ({
    id: eventStore.editingEvent ? eventStore.editingEvent.id : undefined,
    title: eventStore.title,
    date: eventStore.date,
    startTime: eventStore.startTime,
    endTime: eventStore.endTime,
    description: eventStore.description,
    location: eventStore.location,
    category: eventStore.category,
    repeat: {
      type: eventStore.isRepeating ? eventStore.repeatType : 'none',
      interval: eventStore.repeatInterval,
      endDate: eventStore.repeatEndDate || undefined,
    },
    notificationTime: eventStore.notificationTime,
  });

  const handleClose = () => setIsOverlapDialogOpen(false);

  const handleConfirm = (saveEvent: (event: Event | EventForm) => void) => {
    setIsOverlapDialogOpen(false);
    saveEvent(createEventData());
  };

  return { createEventData, cancelRef, handleClose, handleConfirm };
};
