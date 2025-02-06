import {
  Button,
  Checkbox,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  Tooltip,
  FormControl,
  VStack,
  useToast,
} from '@chakra-ui/react';

import { CATEGORIES, NOTIFICATION_OPTIONS } from '../../constants';
import { useEventStore } from '../../stores';
import { useOverlapDialogStore } from '../../stores/useOverlapDialogStore';

import { useEventForm } from '@/hooks/useEventForm';
import { Event, EventForm, RepeatType } from '@/types';
import { findOverlappingEvents } from '@/utils/eventOverlap';
import { getTimeErrorMessage } from '@/utils/timeValidation';

interface EventFormComponentProps {
  events: Event[];
  saveEvent: (event: Event | EventForm) => void;
}

export const EventFormComponent = ({ events, saveEvent }: EventFormComponentProps) => {
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

  return (
    <VStack w="400px" spacing={5} align="stretch">
      <Heading>{eventStore.editingEvent ? '일정 수정' : '일정 추가'}</Heading>

      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input value={eventStore.title} onChange={(e) => eventStore.setTitle(e.target.value)} />
      </FormControl>

      <FormControl>
        <FormLabel>날짜</FormLabel>
        <Input
          type="date"
          value={eventStore.date}
          onChange={(e) => eventStore.setDate(e.target.value)}
        />
      </FormControl>

      <HStack width="100%">
        <FormControl>
          <FormLabel>시작 시간</FormLabel>
          <Tooltip
            label={eventStore.startTimeError}
            isOpen={!!eventStore.startTimeError}
            placement="top"
          >
            <Input
              type="time"
              value={eventStore.startTime}
              onChange={handleStartTimeChange}
              onBlur={() => getTimeErrorMessage(eventStore.startTime, eventStore.endTime)}
              isInvalid={!!eventStore.startTimeError}
            />
          </Tooltip>
        </FormControl>
        <FormControl>
          <FormLabel>종료 시간</FormLabel>
          <Tooltip
            label={eventStore.endTimeError}
            isOpen={!!eventStore.endTimeError}
            placement="top"
          >
            <Input
              type="time"
              value={eventStore.endTime}
              onChange={handleEndTimeChange}
              onBlur={() => getTimeErrorMessage(eventStore.startTime, eventStore.endTime)}
              isInvalid={!!eventStore.endTimeError}
            />
          </Tooltip>
        </FormControl>
      </HStack>

      <FormControl>
        <FormLabel>설명</FormLabel>
        <Input
          value={eventStore.description}
          onChange={(e) => eventStore.setDescription(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>위치</FormLabel>
        <Input
          value={eventStore.location}
          onChange={(e) => eventStore.setLocation(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>카테고리</FormLabel>
        <Select
          value={eventStore.category}
          onChange={(e) => eventStore.setCategory(e.target.value)}
        >
          <option value="">카테고리 선택</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>반복 설정</FormLabel>
        <Checkbox
          isChecked={eventStore.isRepeating}
          onChange={(e) => eventStore.setIsRepeating(e.target.checked)}
        >
          반복 일정
        </Checkbox>
      </FormControl>

      <FormControl>
        <FormLabel>알림 설정</FormLabel>
        <Select
          value={eventStore.notificationTime}
          onChange={(e) => eventStore.setNotificationTime(Number(e.target.value))}
        >
          {NOTIFICATION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </FormControl>

      {eventStore.isRepeating && (
        <VStack width="100%">
          <FormControl>
            <FormLabel>반복 유형</FormLabel>
            <Select
              value={eventStore.repeatType}
              onChange={(e) => eventStore.setRepeatType(e.target.value as RepeatType)}
            >
              <option value="daily">매일</option>
              <option value="weekly">매주</option>
              <option value="monthly">매월</option>
              <option value="yearly">매년</option>
            </Select>
          </FormControl>
          <HStack width="100%">
            <FormControl>
              <FormLabel>반복 간격</FormLabel>
              <Input
                type="number"
                value={eventStore.repeatInterval}
                onChange={(e) => eventStore.setRepeatInterval(Number(e.target.value))}
                min={1}
              />
            </FormControl>
            <FormControl>
              <FormLabel>반복 종료일</FormLabel>
              <Input
                type="date"
                value={eventStore.repeatEndDate}
                onChange={(e) => eventStore.setRepeatEndDate(e.target.value)}
              />
            </FormControl>
          </HStack>
        </VStack>
      )}

      <Button data-testid="event-submit-button" onClick={addOrUpdateEvent} colorScheme="blue">
        {eventStore.editingEvent ? '일정 수정' : '일정 추가'}
      </Button>
    </VStack>
  );
};
