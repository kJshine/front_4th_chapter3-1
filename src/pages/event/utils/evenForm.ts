import { EventStore } from '../stores';

import { Event, EventForm } from '@/types';

export const createEventDataFromStore = (eventStore: EventStore): Event | EventForm => ({
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
});
