import {
  Button,
  Checkbox,
  FormLabel,
  Heading,
  HStack,
  FormControl,
  VStack,
} from '@chakra-ui/react';

import { RepeatSettings } from './features';
import { useAddEventForm } from './hooks';
import { CATEGORIES, NOTIFICATION_OPTIONS } from '../../constants';
import { useEventStore } from '../../stores';

import { InputField, SelectField, TimeField } from '@/shared/ui';
import { Event, EventForm } from '@/types';
import { getTimeErrorMessage } from '@/utils/timeValidation';

interface AddEventFormProps {
  events: Event[];
  saveEvent: (event: Event | EventForm) => void;
}

export const AddEventForm = ({ events, saveEvent }: AddEventFormProps) => {
  const eventStore = useEventStore();
  const { handleStartTimeChange, handleEndTimeChange, addOrUpdateEvent } = useAddEventForm({
    events,
    saveEvent,
  });

  return (
    <VStack w="400px" spacing={5} align="stretch">
      <Heading>{eventStore.editingEvent ? '일정 수정' : '일정 추가'}</Heading>

      <InputField label="제목" value={eventStore.title} onChange={eventStore.setTitle} />

      <InputField type="date" label="날짜" value={eventStore.date} onChange={eventStore.setDate} />

      <HStack width="100%">
        <TimeField
          label="시작 시간"
          value={eventStore.startTime}
          error={eventStore.startTimeError}
          onChange={handleStartTimeChange}
          onBlur={() => getTimeErrorMessage(eventStore.startTime, eventStore.endTime)}
        />
        <TimeField
          label="종료 시간"
          value={eventStore.endTime}
          error={eventStore.endTimeError}
          onChange={handleEndTimeChange}
          onBlur={() => getTimeErrorMessage(eventStore.startTime, eventStore.endTime)}
        />
      </HStack>

      <InputField
        label="설명"
        value={eventStore.description}
        onChange={eventStore.setDescription}
      />

      <InputField label="위치" value={eventStore.location} onChange={eventStore.setLocation} />

      <SelectField
        label="카테고리"
        value={eventStore.category}
        options={CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
        onChange={(e) => eventStore.setCategory(e.target.value)}
      />

      <FormControl>
        <FormLabel>반복 설정</FormLabel>
        <Checkbox
          isChecked={eventStore.isRepeating}
          onChange={(e) => eventStore.setIsRepeating(e.target.checked)}
        >
          반복 일정
        </Checkbox>
      </FormControl>

      <SelectField
        label="알림 설정"
        value={eventStore.notificationTime}
        options={NOTIFICATION_OPTIONS.map((option) => ({
          value: option.value,
          label: option.label,
        }))}
        onChange={(e) => eventStore.setNotificationTime(Number(e.target.value))}
      />

      {eventStore.isRepeating && <RepeatSettings />}

      <Button data-testid="event-submit-button" onClick={addOrUpdateEvent} colorScheme="blue">
        {eventStore.editingEvent ? '일정 수정' : '일정 추가'}
      </Button>
    </VStack>
  );
};
