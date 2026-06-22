import axiosInstance from '../utils/axiosInstance';
import Server from '../constants/server';
import axios from 'axios';

// Roles  --> Coordinator, Principal, Staff

// ==================== AUTH APIS ====================

export const loginUser = async payload => {
  try {
    const response = await axiosInstance.post('/EP/login', payload);
    return response?.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

export const changePassword = async payload => {
  try {
    const response = await axiosInstance.post('/EP/change-password', payload);
    return response?.data;
  } catch (error) {
    console.error('Change password error:', error.response?.data || error.message);
    throw error;
  }
};

export const forgotPassword = async payload => {
  try {
    const response = await axiosInstance.post('/EP/forgot-password', payload);
    return response?.data;
  } catch (error) {
    console.error('Forgot password error:', error.response?.data || error.message);
    throw error;
  }
};

// ==================== DASHBOARD APIS ====================

export const getUserDashboard = async empId => {
  try {
    const response = await axiosInstance.get('/EP/User-Dashboard', {
      params: { Empid: empId }
    });
    return response?.data;
  } catch (error) {
    console.error('Get dashboard error:', error.response?.data || error.message);
    throw error;
  }
};

// ==================== LEAVE APIS ====================

export const getEmpAllLeaveListHistory = async empId => {
  try {
    const response = await axiosInstance.get(
      `/EP/Emp-AllLeaveListHistory-${empId}`,
    );
    return response?.data;
  } catch (error) {
    console.error(
      'Get leave history error:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getEmpLeaveBalanceList = async empId => {
  try {
    const response = await axiosInstance.get(
      `/EP/Emp-LeaveBalenceList-${empId}`,
    );
    return response?.data;
  } catch (error) {
    console.error(
      'Get leave balance error:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const applyLeave = async payload => {
  try {
    const response = await axiosInstance.post('/EP/apply-leave', payload);
    return response?.data;
  } catch (error) {
    console.error('Apply leave error:', error.response?.data || error.message);
    throw error;
  }
};

// ==================== GRADE & CLASS APIS ====================

export const getEmpAssignGradeList = async empId => {
  try {
    const response = await axiosInstance.get(
      `/EP/Emp-AssignGradeList-${empId}`,
    );
    return response?.data;
  } catch (error) {
    console.error(
      'Get assigned grades error:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getGradesByClasses = async (schoolId, gradeId) => {
  try {
    const response = await axiosInstance.get('/EP/GetGradesByClasses', {
      params: {
        SchoolID: schoolId,
        GradeID: gradeId
      }
    });
    return response?.data;
  } catch (error) {
    console.error(
      'Get grades by classes error:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getClassesBySection = async (schoolId, classId, userId) => {
  try {
    const response = await axiosInstance.get('/EP/GetClassesBySection', {
      params: {
        SchoolID: schoolId,
        ClassID: classId,
        UserID: userId
      }
    });
    return response?.data;
  } catch (error) {
    console.error(
      'Get classes by section error:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getEmployeeAssignedClassesStudents = async (schoolId, empId, classId) => {
  try {
    const response = await axiosInstance.get(
      '/EP/GetEmployeeAssignedClassesStudents',
      {
        params: {
          SchoolId: schoolId,
          Empid: empId,
          ClassId: classId
        }
      }
    );
    return response?.data;
  } catch (error) {
    console.error(
      'Get assigned classes students error:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

// ==================== ATTENDANCE APIS ====================

export const getStudentForAttendance = async payload => {
  try {
    const response = await axiosInstance.post(
      '/EP/GetStudentForAttendance',
      payload,
    );
    return response?.data;
  } catch (error) {
    console.error(
      'Get students for attendance error:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const markStudentsAttendance = async payload => {
  try {
    const response = await axiosInstance.post(
      '/EP/MarkStudentsAttendance',
      payload,
    );
    return response?.data;
  } catch (error) {
    console.error(
      'Mark attendance error:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getEmployeeAttendanceSummary = async payload => {
  try {
    const response = await axiosInstance.post(
      '/EP/GetEmployeeAttendanceSummary',
      payload,
    );
    return response?.data;
  } catch (error) {
    console.error(
      'Get attendance summary error:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getStudentLast7DaysAttendanceHistory = async () => {
  try {
    const response = await axiosInstance.get(
      '/EP/GetStudentLast7DaysAttendaceHistory',
    );
    return response?.data;
  } catch (error) {
    console.error(
      'Get attendance history error:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

// ==================== ADMIN/PRINCIPAL APIS ====================

export const getPrincipalPendingRequests = async () => {
  try {
    const response = await axiosInstance.get('/EP/GetPrincipalPendingRequests');
    return response?.data;
  } catch (error) {
    console.error(
      'Get pending requests error:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getUnapprovedStaffLeaveRequest = async schoolId => {
  try {
    const response = await axiosInstance.get('/EP/GetUnapprovedStaffLeaveRequest', {
      params: { schoolId }
    });
    return response?.data;
  } catch (error) {
    console.error(
      'Get unapproved staff leave requests error:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getTeacherDailySchedule = async (empId, date) => {
  try {
    const response = await axiosInstance.get('/EP/GetTeacherDailySchedule', {
      params: {
        EmpId: empId,
        Date: date
      }
    });
    console.log('Date: ', date)
    return response?.data;
  } catch (error) {
    console.error(
      'Get teacher daily schedule error:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getHRShift = async () => {
  try {
    const response = await axiosInstance.get('/EP/GetHRShift');
    return response?.data;
  } catch (error) {
    console.error('Get HR shift error:', error.response?.data || error.message);
    throw error;
  }
};

export const getEmployeesShift = async (date, shiftId, schoolId) => {
  try {
    const response = await axiosInstance.get('/EP/GetEmployeesShift', {
      params: {
        Date: date,
        ShiftId: Number(shiftId) || 0,
        SchoolID: Number(schoolId) || 0
      }
    });
    return response?.data;
  } catch (error) {
    console.error('Get employees shift error:', error.response?.data || error.message);
    throw error;
  }
};

export const markEmployeeAttendance = async (payload) => {
  try {
    const response = await axiosInstance.post('/EP/MarkEmployeeAttendance', payload);
    return response?.data;
  } catch (error) {
    console.error('Mark employee attendance error:', error.response?.data || error.message);
    throw error;
  }
};

export const getEmployeesAttendanceLast7Days = async (schoolId) => {
  try {
    const response = await axiosInstance.get('/EP/GetEmployeesAttendanceLast7Days', {
      params: { schoolId }
    });
    return response?.data;
  } catch (error) {
    console.error('Get employees attendance last 7 days error:', error.response?.data || error.message);
    throw error;
  }
};