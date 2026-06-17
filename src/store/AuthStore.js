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
      userType: null,
      image: null,
      schoolCount: null,
      phoneNo: null,
      email: null,

      setAuth: (user, role, accessToken, schoolId, empId, userId, userType, image, schoolCount, phoneNo, email) => {
        set({ user, role, accessToken, isAuthenticated: true, schoolId, empId, userId, userType, image, schoolCount, phoneNo, email })
      },

      updateUser: (updates) =>
        set((state) => ({ user: { ...state.user, ...updates } })),

      logout: async () => {
        useProfileDetailsStore.getState().clearProfileDetails();
        set({ 
          user: null, 
          role: null, 
          accessToken: null, 
          isAuthenticated: false, 
          schoolId: null, 
          empId: null, 
          userId: null,
          userType: null,
          image: null,
          schoolCount: null,
          phoneNo: null,
          email: null
        })
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
        userType: state.userType,
        image: state.image,
        schoolCount: state.schoolCount,
        phoneNo: state.phoneNo,
        email: state.email,
      }),
    },
  ),
)
