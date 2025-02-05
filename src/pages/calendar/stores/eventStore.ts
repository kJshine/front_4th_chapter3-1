import { create } from 'zustand';

interface EventStore {
  isOverlapDialogOpen: boolean;
  overlappingEvents: Event[];
}

export const useEventStore = create<EventStore>((set) => ({
  isOverlapDialogOpen: false,
  overlappingEvents: [],
  validateAndSaveEvent: async (eventData) => {
    // 유효성 검사 및 저장 로직
  },
  // ...
}));
