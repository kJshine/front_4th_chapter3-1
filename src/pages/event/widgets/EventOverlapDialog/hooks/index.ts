import { useRef } from 'react';

import { useEventStore, useOverlapDialogStore } from '@/pages/event/stores';
import { createEventDataFromStore } from '@/pages/event/utils';
import { Event, EventForm } from '@/types';

export const useEventOverlapDialog = () => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const eventStore = useEventStore();

  const { setIsOverlapDialogOpen } = useOverlapDialogStore();

  const handleClose = () => setIsOverlapDialogOpen(false);

  const handleConfirm = (saveEvent: (event: Event | EventForm) => void) => {
    setIsOverlapDialogOpen(false);

    const eventData: Event | EventForm = createEventDataFromStore(eventStore);
    saveEvent(eventData);
  };

  return { cancelRef, handleClose, handleConfirm };
};
