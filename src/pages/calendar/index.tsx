import { Box, Flex, useToast } from '@chakra-ui/react';
import { useRef, useState } from 'react';

import { EventFormComponent } from './components/EventForm';
import { EventOverlapDialog } from './components/EventOverlapDialog';
import { EventSearch } from './components/EventSearch';
import { EventView } from './components/EventView';
import { NotificationAlert } from './components/NotificationAlert';

import { useCalendarView } from '@/hooks/useCalendarView';
import { useEventForm } from '@/hooks/useEventForm';
import { useEventOperations } from '@/hooks/useEventOperations';
import { useNotifications } from '@/hooks/useNotifications';
import { useSearch } from '@/hooks/useSearch';
import { Event, EventForm } from '@/types';
import { findOverlappingEvents } from '@/utils/eventOverlap';

export const CalendarPage = () => {
  const {
    title,
    setTitle,
    date,
    setDate,
    startTime,
    endTime,
    description,
    setDescription,
    location,
    setLocation,
    category,
    setCategory,
    isRepeating,
    setIsRepeating,
    repeatType,
    setRepeatType,
    repeatInterval,
    setRepeatInterval,
    repeatEndDate,
    setRepeatEndDate,
    notificationTime,
    setNotificationTime,
    startTimeError,
    endTimeError,
    editingEvent,
    setEditingEvent,
    handleStartTimeChange,
    handleEndTimeChange,
    resetForm,
    editEvent,
  } = useEventForm();

  const { events, saveEvent, deleteEvent } = useEventOperations(Boolean(editingEvent), () =>
    setEditingEvent(null)
  );

  const { notifications, notifiedEvents, setNotifications } = useNotifications(events);
  const { view, setView, currentDate, holidays, navigate } = useCalendarView();
  const { searchTerm, filteredEvents, setSearchTerm } = useSearch(events, currentDate, view);

  const [isOverlapDialogOpen, setIsOverlapDialogOpen] = useState(false);
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const toast = useToast();

  const addOrUpdateEvent = async () => {
    if (!title || !date || !startTime || !endTime) {
      toast({
        title: '필수 정보를 모두 입력해주세요.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (startTimeError || endTimeError) {
      toast({
        title: '시간 설정을 확인해주세요.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const eventData: Event | EventForm = {
      id: editingEvent ? editingEvent.id : undefined,
      title,
      date,
      startTime,
      endTime,
      description,
      location,
      category,
      repeat: {
        type: isRepeating ? repeatType : 'none',
        interval: repeatInterval,
        endDate: repeatEndDate || undefined,
      },
      notificationTime,
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
    <Box w="full" h="100vh" m="auto" p={5}>
      <Flex gap={6} h="full">
        <EventFormComponent
          editingEvent={editingEvent}
          handleStartTimeChange={handleStartTimeChange}
          handleEndTimeChange={handleEndTimeChange}
          title={title}
          setTitle={setTitle}
          date={date}
          setDate={setDate}
          startTime={startTime}
          endTime={endTime}
          description={description}
          location={location}
          setLocation={setLocation}
          category={category}
          setCategory={setCategory}
          isRepeating={isRepeating}
          setIsRepeating={setIsRepeating}
          repeatType={repeatType}
          setRepeatType={setRepeatType}
          repeatInterval={repeatInterval}
          setRepeatInterval={setRepeatInterval}
          repeatEndDate={repeatEndDate}
          setRepeatEndDate={setRepeatEndDate}
          notificationTime={notificationTime}
          setNotificationTime={setNotificationTime}
          startTimeError={startTimeError}
          endTimeError={endTimeError}
          setDescription={setDescription}
          addOrUpdateEvent={addOrUpdateEvent}
        />

        <EventView
          view={view}
          setView={setView}
          currentDate={currentDate}
          holidays={holidays}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
          navigate={navigate}
        />

        <EventSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredEvents={filteredEvents}
          editEvent={editEvent}
          deleteEvent={deleteEvent}
          notifiedEvents={notifiedEvents}
        />
      </Flex>

      <EventOverlapDialog
        isOverlapDialogOpen={isOverlapDialogOpen}
        setIsOverlapDialogOpen={setIsOverlapDialogOpen}
        overlappingEvents={overlappingEvents}
        cancelRef={cancelRef}
        saveEvent={saveEvent}
        editingEvent={editingEvent}
        title={title}
        date={date}
        startTime={startTime}
        endTime={endTime}
        description={description}
        location={location}
        category={category}
        repeatType={repeatType}
        repeatInterval={repeatInterval}
        repeatEndDate={repeatEndDate}
        notificationTime={notificationTime}
        isRepeating={isRepeating}
      />

      {notifications.length > 0 && (
        <NotificationAlert notifications={notifications} setNotifications={setNotifications} />
      )}
    </Box>
  );
};
