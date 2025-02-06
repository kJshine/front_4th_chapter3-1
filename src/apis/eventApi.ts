import { Event, EventForm } from '@/types';

export const eventApi = {
  fetchEvents: async () => {
    const response = await fetch('/api/events');
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    const { events } = await response.json();
    return events;
  },

  updateEvent: async (eventData: Event | EventForm) => {
    const response = await fetch(`/api/events/${(eventData as Event).id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error('Failed to update event');
    }
  },

  createEvent: async (eventData: Event | EventForm) => {
    const response = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error('Failed to create event');
    }
  },

  deleteEvent: async (id: string) => {
    const response = await fetch(`/api/events/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete event');
    }
  },
};
