import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Space } from '../_types';
import { DataManager } from '../_utils/dataManager';

interface SpaceState {
  spaces: Space[];
  currentSpaceId: string | null;
  loadSpaces: (userId: string) => Promise<void>;
  setCurrentSpace: (spaceId: string) => void;
  addSpace: (space: Space) => Promise<void>;
  updateSpace: (spaceId: string, updates: Partial<Space>) => Promise<void>;
  deleteSpace: (spaceId: string) => Promise<void>;
  getCurrentSpace: () => Space | null;
}

export const useSpaceStore = create<SpaceState>()(
  persist(
    (set, get) => ({
      spaces: [],
      currentSpaceId: null,

      loadSpaces: async (userId: string) => {
        try {
          const spaces = await DataManager.getSpacesByUserId(userId);
          
          set({
            spaces,
            // Auto-select first space if none selected
            currentSpaceId: get().currentSpaceId || (spaces.length > 0 ? spaces[0].id : null),
          });
        } catch (error) {
          console.error('Error loading spaces:', error);
        }
      },

      setCurrentSpace: (spaceId: string) => {
        set({ currentSpaceId: spaceId });
      },

      addSpace: async (space: Space) => {
        try {
          await DataManager.addSpace(space);
          
          set((state) => ({
            spaces: [...state.spaces, space],
            currentSpaceId: space.id, // Auto-select newly created space
          }));
        } catch (error) {
          console.error('Error adding space:', error);
        }
      },

      updateSpace: async (spaceId: string, updates: Partial<Space>) => {
        try {
          await DataManager.updateSpace(spaceId, updates);
          
          set((state) => ({
            spaces: state.spaces.map((space) =>
              space.id === spaceId ? { ...space, ...updates } : space
            ),
          }));
        } catch (error) {
          console.error('Error updating space:', error);
        }
      },

      deleteSpace: async (spaceId: string) => {
        try {
          await DataManager.deleteSpace(spaceId);
          
          set((state) => {
            const newSpaces = state.spaces.filter((space) => space.id !== spaceId);
            return {
              spaces: newSpaces,
              // If deleted space was current, switch to first available space
              currentSpaceId:
                state.currentSpaceId === spaceId
                  ? newSpaces.length > 0
                    ? newSpaces[0].id
                    : null
                  : state.currentSpaceId,
            };
          });
        } catch (error) {
          console.error('Error deleting space:', error);
        }
      },

      getCurrentSpace: () => {
        const { spaces, currentSpaceId } = get();
        return spaces.find((space) => space.id === currentSpaceId) || null;
      },
    }),
    {
      name: 'space-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

