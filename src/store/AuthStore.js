import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      role: null,   // 'coordinator', 'principal', 'staff'
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, role, accessToken) => {
        set({ user, role, accessToken, isAuthenticated: true })
      },

      // Demo mode - bypass authentication for testing
      demoLogin: () => {
        const demoUser = {
          id: 'demo-user-123',
          name: 'Demo User',
          role: 'coordinator',
          email: 'demo@prepmate.com',
        }
        const demoToken = 'demo-token-' + Date.now()
        set({ user: demoUser, role: demoUser.role, accessToken: demoToken, isAuthenticated: true })
      },

      updateUser: (updates) =>
        set((state) => ({ user: { ...state.user, ...updates } })),

      logout: async () => {
        // await AsyncStorage.removeItem('hasSeenOnboarding');
        set({ user: null, role: null, accessToken: null, isAuthenticated: false })
      },
    }),
    {
      name: 'UserAuth', // name of the item in storage
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        role: state.role,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
