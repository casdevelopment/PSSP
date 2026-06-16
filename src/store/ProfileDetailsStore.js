import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useProfileDetailsStore = create(
  persist(
    (set) => ({
      profileDetails: null,

      setProfileDetails: (details) => set({ profileDetails: details }),

      clearProfileDetails: () => set({ profileDetails: null }),
    }),
    {
      name: 'ProfileDetails',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
