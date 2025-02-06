import { VStack, HStack } from '@chakra-ui/react';

import { useEventStore } from '../../../stores';

import { InputField, SelectField } from '@/shared/ui';
import { RepeatType } from '@/types';

// RepeatSettings.tsx
export const RepeatSettings = () => {
  const eventStore = useEventStore();

  if (!eventStore.isRepeating) return null;

  const REPEAT_TYPE_OPTIONS = [
    { value: 'daily', label: '매일' },
    { value: 'weekly', label: '매주' },
    { value: 'monthly', label: '매월' },
    { value: 'yearly', label: '매년' },
  ];

  return (
    <VStack width="100%">
      <SelectField
        label="반복 유형"
        value={eventStore.repeatType}
        options={REPEAT_TYPE_OPTIONS}
        onChange={(e) => eventStore.setRepeatType(e.target.value as RepeatType)}
      />
      <HStack width="100%">
        <InputField
          label="반복 간격"
          value={eventStore.repeatInterval}
          onChange={(value) => eventStore.setRepeatInterval(Number(value))}
          min={1}
        />
        <InputField
          type="date"
          label="반복 종료일"
          value={eventStore.repeatEndDate}
          onChange={eventStore.setRepeatEndDate}
        />
      </HStack>
    </VStack>
  );
};
