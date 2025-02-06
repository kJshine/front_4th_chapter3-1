import { useToast } from '@chakra-ui/react';

import { useEventForm } from '@/hooks/useEventForm';
import { useEventStore, useOverlapDialogStore } from '@/pages/event/stores';
import { createEventDataFromStore } from '@/pages/event/utils';
import { TOAST_CONFIG, TOAST_STATUS } from '@/shared/model';
import { EventForm, Event } from '@/types';
import { findOverlappingEvents } from '@/utils/eventOverlap';

const TOAST_MESSAGE = {
  REQUIRED: '필수 정보를 모두 입력해주세요.',
  TIME_ERROR: '시간 설정을 확인해주세요.',
} as const;

interface AddEventFormProps {
  events: Event[];
  saveEvent: (event: Event | EventForm) => void;
}

export const useAddEventForm = ({ events, saveEvent }: AddEventFormProps) => {
  const eventStore = useEventStore();
  const toast = useToast();

  const { resetForm, handleStartTimeChange, handleEndTimeChange } = useEventForm();
  const { setIsOverlapDialogOpen, setOverlappingEvents } = useOverlapDialogStore();

  const addOrUpdateEvent = async () => {
    if (!eventStore.title || !eventStore.date || !eventStore.startTime || !eventStore.endTime) {
      toast({
        title: TOAST_MESSAGE.REQUIRED,
        status: TOAST_STATUS.ERROR,
        ...TOAST_CONFIG.DEFAULT,
      });
      return;
    }

    if (eventStore.startTimeError || eventStore.endTimeError) {
      toast({
        title: TOAST_MESSAGE.TIME_ERROR,
        status: TOAST_STATUS.ERROR,
        ...TOAST_CONFIG.DEFAULT,
      });
      return;
    }

    const eventData: Event | EventForm = createEventDataFromStore(eventStore);

    const overlapping = findOverlappingEvents(eventData, events);
    if (overlapping.length > 0) {
      setOverlappingEvents(overlapping);
      setIsOverlapDialogOpen(true);
    } else {
      await saveEvent(eventData);
      resetForm();
    }
  };

  return {
    handleStartTimeChange,
    handleEndTimeChange,
    addOrUpdateEvent,
  };
};
