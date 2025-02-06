import { useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { Event, EventForm } from '../types';

import { eventApi } from '@/apis';
import { TOAST_CONFIG, TOAST_STATUS } from '@/shared/model';

const TOAST_MESSAGE = {
  SUCCESS: '일정이 저장되었습니다.',
  ERROR: '일정 저장 실패',
  UPDATE_SUCCESS: '일정이 수정되었습니다.',
  UPDATE_ERROR: '일정 수정 실패',
  CREATE_SUCCESS: '일정이 추가되었습니다.',
  CREATE_ERROR: '일정 추가 실패',
  DELETE_SUCCESS: '일정이 삭제되었습니다.',
  DELETE_ERROR: '일정 삭제 실패',
  LOADING_SUCCESS: '일정 로딩 완료!',
  LOADING_ERROR: '이벤트 로딩 실패',
} as const;

export const useEventOperations = (editing: boolean, onSave?: () => void) => {
  const [events, setEvents] = useState<Event[]>([]);
  const toast = useToast();

  const fetchEvents = async () => {
    try {
      const events = await eventApi.fetchEvents();
      setEvents(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: TOAST_MESSAGE.LOADING_ERROR,
        status: TOAST_STATUS.ERROR,
        ...TOAST_CONFIG.DEFAULT,
      });
    }
  };

  const saveEvent = async (eventData: Event | EventForm) => {
    try {
      if (editing) {
        await eventApi.updateEvent(eventData);
      } else {
        await eventApi.createEvent(eventData);
      }

      await fetchEvents();
      onSave?.();
      toast({
        title: editing ? TOAST_MESSAGE.UPDATE_SUCCESS : TOAST_MESSAGE.CREATE_SUCCESS,
        status: TOAST_STATUS.SUCCESS,
        ...TOAST_CONFIG.DEFAULT,
      });
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: TOAST_MESSAGE.ERROR,
        status: TOAST_STATUS.ERROR,
        ...TOAST_CONFIG.DEFAULT,
      });
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await eventApi.deleteEvent(id);
      await fetchEvents();
      toast({
        title: TOAST_MESSAGE.DELETE_SUCCESS,
        status: TOAST_STATUS.INFO,
        ...TOAST_CONFIG.DEFAULT,
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: TOAST_MESSAGE.DELETE_ERROR,
        status: TOAST_STATUS.ERROR,
        ...TOAST_CONFIG.DEFAULT,
      });
    }
  };

  async function init() {
    await fetchEvents();
    toast({
      title: TOAST_MESSAGE.LOADING_SUCCESS,
      status: TOAST_STATUS.INFO,
      ...TOAST_CONFIG.LOADING,
    });
  }

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { events, fetchEvents, saveEvent, deleteEvent };
};
