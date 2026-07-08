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

export const getStudentLast7DaysAttendanceHistory = async (studentId) => {
  try {
    const response = await axiosInstance.get(
      '/EP/GetStudentLast7DaysAttendaceHistory',
      {
        params: { StudentId: studentId }
      }
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

export const getEmployeesAttendanceLast7Days = async (schoolId, fromDate, toDate) => {
  try {
    const response = await axiosInstance.get('/EP/GetEmployeesAttendanceLast7Days', {
      params: {
        SchoolId: schoolId,
        FromDate: fromDate,
        ToDate: toDate
      }
    });
    return response?.data;
  } catch (error) {
    console.error('Get employees attendance last 7 days error:', error.response?.data || error.message);
    throw error;
  }
};


export const getStaffList = async (schoolId) => {
  try {
    const response = await axiosInstance.get('/EP/GetStaffList', {
      params: { SchoolId: schoolId }
    });
    return response?.data;
  } catch (error) {
    console.error('Get staff list error:', error.response?.data || error.message);
    throw error;
  }
};

export const getEmployeeDetailsWithStudentCount = async (employeeId) => {
  try {
    const response = await axiosInstance.get('/EP/GetEmployeeDetailsWithStudentCount', {
      params: { EmployeeId: employeeId }
    });
    return response?.data;
  } catch (error) {
    console.error('Get employee details error:', error.response?.data || error.message);
    throw error;
  }
};


export const getEmployeeSchoolDashboardDetails = async (empId) => {
  try {
    const response = await axiosInstance.get(`/EP/GetEmployeeSchoolDashboardDetails${empId}`);
    return response?.data;
  } catch (error) {
    console.error('Error fetching employee school dashboard details:', error.response?.data || error.message);
    throw error;
  }
};

export const getUnapprovedPrincipalLeaveRequest = async (empId) => {
  try {
    const response = await axiosInstance.get(`/EP/GetUnapprovedPrincipalLeaveRequest${empId}`);
    console.log('Principle Leave Request: ', response?.data)
    return response?.data;
  } catch (error) {
    console.error('Get unapproved principal leave requests error:', error.response?.data || error.message);
    throw error;
  }
};

export const approveStaffAndPrincipalLeaveRequest = async (leaveId) => {
  try {
    const payload = {
      LeaveId: Number(leaveId),
    };
    const response = await axiosInstance.post(
      '/EP/ApproveStaffAndPrincipalLeaveRequest',
      payload,
      {
        params: payload
      }
    );
    return response?.data;
  } catch (error) {
    console.error('Approve staff and principal leave request error:', error.response?.data || error.message);
    throw error;
  }
};

export const getExpensePendingListSchool = async (empId, fromDate, toDate) => {
  try {
    const response = await axiosInstance.get(`/EP/GetExpensePendingListSchool${empId}`, {
      params: {
        FromDate: fromDate,
        ToDate: toDate
      }
    });
    return response?.data;
  } catch (error) {
    console.error('Get expense pending list error:', error.response?.data || error.message);
    throw error;
  }
};

export const getExpenseDetailsWithSchool = async (expId) => {
  try {
    const response = await axiosInstance.get(`/EP/GetExpenseDetailsWithSchool${expId}`);
    return response?.data;
  } catch (error) {
    console.error('Get expense details error:', error.response?.data || error.message);
    throw error;
  }
};

export const postExpense = async (payload) => {
  try {
    const response = await axiosInstance.post('/EP/PostExpense', payload);
    return response?.data;
  } catch (error) {
    console.error('Post expense error:', error.response?.data || error.message);
    throw error;
  }
};

// ==================== SALARY APIS ====================

export const getEmployeeCurrentSalary = async (empId) => {
  try {
    const response = await axiosInstance.get('/EP/GetEmployeeCurrentSalary', {
      params: { EmpId: empId }
    });
    return response?.data;
  } catch (error) {
    console.error('Get employee current salary error:', error.response?.data || error.message);
    throw error;
  }
};

export const getEmployeeSalaryHistory = async (empId, year) => {
  try {
    const response = await axiosInstance.get('/EP/GetEmployeeSalaryHistory', {
      params: { EmpId: empId, Year: year }
    });
    return response?.data;
  } catch (error) {
    console.error('Get employee salary history error:', error.response?.data || error.message);
    throw error;
  }
};

export const getEmployeeSalaryDetails = async (empId, registerId) => {
  try {
    const response = await axiosInstance.get('/EP/GetEmployeeSalaryDetails', {
      params: {
        EmpId: empId,
        RegisterId: registerId
      }
    });
    return response?.data;
  } catch (error) {
    console.error('Get employee salary details error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateSalaryAcknowledgement = async (empId, registerId) => {
  try {
    const payload = {
      EmpId: empId,
      RegisterId: registerId
    };
    const response = await axiosInstance.post(
      '/EP/UpdateSalaryAcknowledgement',
      payload,
      {
        params: payload
      }
    );
    return response?.data;
  } catch (error) {
    console.error('Update salary acknowledgement error:', error.response?.data || error.message);
    throw error;
  }
};

export const principalSalaryAcknowledgement = async (payload) => {
  try {
    const response = await axiosInstance.post('/EP/PrincipalSalaryAcknowledgement', payload);
    return response?.data;
  } catch (error) {
    console.error('Principal salary acknowledgement error:', error.response?.data || error.message);
    throw error;
  }
};

export const getEmployeeSalaryStatusBySchool = async (schoolId) => {
  try {
    const response = await axiosInstance.get(`/EP/GetEmployeeSalaryStatusBySchool${schoolId}`);
    return response?.data;
  } catch (error) {
    console.error('Get employee salary status by school error:', error.response?.data || error.message);
    throw error;
  }
};

export const getAccountHeadList = async (type) => {
  try {
    const response = await axiosInstance.post('/EP/GetAccountHeadList', JSON.stringify(type));
    return response?.data;
  } catch (error) {
    console.error('Get account head list error:', error.response?.data || error.message);
    throw error;
  }
};

export const saveExpenseList = async (payload) => {
  try {
    const response = await axiosInstance.post('/EP/SaveExpenseList', payload);
    return response?.data;
  } catch (error) {
    console.error('Save expense list error:', error.response?.data || error.message);
    throw error;
  }
};

export const saveSalaryNotAcknowledgement = async (payload) => {
  try {
    const response = await axiosInstance.post('/EP/SaveSalaryNotAcknowledgement', payload);
    return response?.data;
  } catch (error) {
    console.error('Save salary not acknowledgement error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteExpense = async (payload) => {
  try {
    const response = await axiosInstance.post('/EP/DeleteExpense', payload);
    return response?.data;
  } catch (error) {
    console.error('Delete expense error:', error.response?.data || error.message);
    throw error;
  }
};

export const rejectStaffAndPrincipalLeaveRequest = async (payload) => {
  try {
    const response = await axiosInstance.post('/EP/RejectedStaffAndPrincipalLeave', payload);
    return response?.data;
  } catch (error) {
    console.error('Reject staff and principal leave request error:', error.response?.data || error.message);
    throw error;
  }
};





