import { create } from 'zustand';

interface CalmModeStore {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export const useCalmModeStore = create<CalmModeStore>((set) => ({
  isOpen: false,
  setOpen: (open) => set({ isOpen: open }),
}));
