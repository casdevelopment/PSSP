import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken) => {
        set({ user, accessToken, isAuthenticated: true })
      },

      // Demo mode - bypass authentication for testing
      demoLogin: () => {
        const demoUser = {
          id: 'demo-user-123',
          name: 'Demo User',
          email: 'demo@prepmate.com',
        }
        const demoToken = 'demo-token-' + Date.now()
        set({ user: demoUser, accessToken: demoToken, isAuthenticated: true })
      },

      updateUser: (updates) =>
        set((state) => ({ user: { ...state.user, ...updates } })),

      logout: () => {
        set({ user: null, accessToken: null, isAuthenticated: false })
      },
    }),
    {
      name: 'UserAuth', // name of the item in storage
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
