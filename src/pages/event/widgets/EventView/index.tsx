import { VStack, Heading } from '@chakra-ui/react';

import { MonthView, ViewNavigation, WeekView } from './features';

import { useCalendarView } from '@/hooks/useCalendarView';
import { Event } from '@/types';

interface EventViewProps {
  filteredEvents: Event[];
  notifiedEvents: string[];
}

export const EventView = ({ filteredEvents, notifiedEvents }: EventViewProps) => {
  const { view, setView, currentDate, holidays, navigate } = useCalendarView();

  return (
    <VStack flex={1} spacing={5} align="stretch">
      <Heading>일정 보기</Heading>

      <ViewNavigation view={view} setView={setView} navigate={navigate} />

      {view === 'week' && (
        <WeekView
          currentDate={currentDate}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
        />
      )}
      {view === 'month' && (
        <MonthView
          currentDate={currentDate}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
          holidays={holidays}
        />
      )}
    </VStack>
  );
};
