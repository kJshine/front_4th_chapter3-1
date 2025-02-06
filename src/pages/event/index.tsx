import { Box, Flex } from '@chakra-ui/react';

import { useEventStore } from './stores';
import { AddEventForm } from './widgets/AddEventForm';
import { EventOverlapDialog } from './widgets/EventOverlapDialog';
import { EventSearch } from './widgets/EventSearch';
import { EventView } from './widgets/EventView';
import { NotificationAlert } from './widgets/NotificationAlert';

import { useCalendarView } from '@/hooks/useCalendarView';
import { useEventOperations } from '@/hooks/useEventOperations';
import { useNotifications } from '@/hooks/useNotifications';
import { useSearch } from '@/hooks/useSearch';

export const CalendarPage = () => {
  const eventStore = useEventStore();

  const { events, saveEvent, deleteEvent } = useEventOperations(
    Boolean(eventStore.editingEvent),
    () => eventStore.setEditingEvent(null)
  );

  const { notifications, notifiedEvents, setNotifications } = useNotifications(events);
  const { view, currentDate } = useCalendarView();
  const { searchTerm, filteredEvents, setSearchTerm } = useSearch(events, currentDate, view);

  return (
    <Box w="full" h="100vh" m="auto" p={5}>
      <Flex gap={6} h="full">
        <AddEventForm events={events} saveEvent={saveEvent} />

        <EventView filteredEvents={filteredEvents} notifiedEvents={notifiedEvents} />

        <EventSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredEvents={filteredEvents}
          deleteEvent={deleteEvent}
          notifiedEvents={notifiedEvents}
        />
      </Flex>

      <EventOverlapDialog saveEvent={saveEvent} />

      <NotificationAlert notifications={notifications} setNotifications={setNotifications} />
    </Box>
  );
};
