import { useToast } from '@chakra-ui/react';

import { useEventForm } from '@/hooks/useEventForm';
import { useEventStore, useOverlapDialogStore } from '@/pages/calendar/stores';
import { EventForm, Event } from '@/types';
import { findOverlappingEvents } from '@/utils/eventOverlap';

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
        title: '필수 정보를 모두 입력해주세요.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (eventStore.startTimeError || eventStore.endTimeError) {
      toast({
        title: '시간 설정을 확인해주세요.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const eventData: Event | EventForm = {
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
    };

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
