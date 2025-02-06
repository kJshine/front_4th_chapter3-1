import { create } from 'zustand';

import { Event } from '@/types';
interface OverlapDialogStore {
  isOverlapDialogOpen: boolean;
  setIsOverlapDialogOpen: (isOpen: boolean) => void;
  overlappingEvents: Event[];
  setOverlappingEvents: (events: Event[]) => void;
}

export const useOverlapDialogStore = create<OverlapDialogStore>((set) => ({
  isOverlapDialogOpen: false,
  setIsOverlapDialogOpen: (isOpen) => set({ isOverlapDialogOpen: isOpen }),
  overlappingEvents: [],
  setOverlappingEvents: (events) => set({ overlappingEvents: events }),
}));
