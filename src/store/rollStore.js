// store/rollStore.js
import { create } from 'zustand';

export const useRollStore = create((set) => ({
    rolls: [],
    addRoll: (modifier, result, skill, natResult) => {
        const now = new Date();
        const timestamp = now.toLocaleTimeString('en-US');
        set((state) => ({
            rolls: [...state.rolls, { id: Date.now(), modifier, natResult, result, timestamp, skill }],
        }));
    },
    clearRolls: () => set({ rolls: [] }),
}));
