import { VStack } from '@chakra-ui/react';

import { EventList } from './features';

import { useEventForm } from '@/hooks/useEventForm';
import { InputField } from '@/shared/ui';
import { Event } from '@/types';

interface EventSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredEvents: Event[];
  deleteEvent: (id: string) => void;
  notifiedEvents: string[];
}
export const EventSearch = ({
  searchTerm,
  setSearchTerm,
  filteredEvents,
  deleteEvent,
  notifiedEvents,
}: EventSearchProps) => {
  const { editEvent } = useEventForm();

  return (
    <VStack data-testid="event-list" w="500px" h="full" overflowY="auto">
      <InputField label="일정 검색" value={searchTerm} onChange={setSearchTerm} />

      <EventList
        filteredEvents={filteredEvents}
        deleteEvent={deleteEvent}
        notifiedEvents={notifiedEvents}
        editEvent={editEvent}
      />
    </VStack>
  );
};
