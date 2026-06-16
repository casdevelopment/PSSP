import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useProfileDetailsStore } from './ProfileDetailsStore'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      role: null,   // 'coordinator', 'principal', 'staff'
      accessToken: null,
      isAuthenticated: false,
      schoolId: null,
      empId: null,
      userId: null,

      setAuth: (user, role, accessToken, schoolId, empId, userId) => {
        set({ user, role, accessToken, isAuthenticated: true, schoolId, empId, userId })
      },

      // Demo mode - bypass authentication for testing
      // demoLogin: (role) => {
      //   const demoUser = {
      //     id: 'demo-user-123',
      //     name: 'Demo User',
      //     role: role,
      //     email: 'demo@prepmate.com',
      //     schoolId: 'demo-school-456',
      //   }
      //   const demoToken = 'demo-token-' + Date.now()
      //   set({ user: demoUser, role: demoUser.role, accessToken: demoToken, isAuthenticated: true, schoolId: demoUser.schoolId })
      // },

      updateUser: (updates) =>
        set((state) => ({ user: { ...state.user, ...updates } })),

      logout: async () => {
        // await AsyncStorage.removeItem('hasSeenOnboarding');
        useProfileDetailsStore.getState().clearProfileDetails();
        set({ user: null, role: null, accessToken: null, isAuthenticated: false, schoolId: null, empId: null, userId: null })
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
        schoolId: state.schoolId,
        empId: state.empId,
        userId: state.userId,
      }),
    },
  ),
)
