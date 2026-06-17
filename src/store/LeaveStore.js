import { create } from 'zustand';
import { getEmpLeaveBalanceList } from '../network/apis';

export const useLeaveStore = create((set) => ({
  leaveBalances: [],
  isLoadingBalances: false,
  error: null,

  setLeaveBalances: (balances) => set({ leaveBalances: balances }),

  fetchLeaveBalances: async (empId) => {
    if (!empId) return;
    set({ isLoadingBalances: true, error: null });
    try {
      const res = await getEmpLeaveBalanceList(empId);
      if (res && res.success) {
        set({ leaveBalances: res.data || [], error: null });
      } else {
        set({ error: res?.message || 'Failed to fetch leave balances' });
      }
    } catch (err) {
      set({ error: err.message || 'Error fetching leave balances' });
    } finally {
      set({ isLoadingBalances: false });
    }
  },

  clearLeaveBalances: () => set({ leaveBalances: [], error: null, isLoadingBalances: false }),
}));
