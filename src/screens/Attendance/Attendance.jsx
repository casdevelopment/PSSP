import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, TextInput, Alert, Modal, FlatList, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';
import HeroCard from '../../components/HeroCard';
import AttendanceCard from '../../components/AttendanceCard';
import { useAuthStore } from '../../store/AuthStore';

import { getEmpAssignGradeList, getGradesByClasses, getClassesBySection, getStudentForAttendance, markStudentsAttendance, getHRShift, getEmployeesShift, markEmployeeAttendance } from '../../network/apis';

export default function Attendance() {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const navigation = useNavigation();
  const role = useAuthStore((state) => state.userType);
  const empId = useAuthStore((state) => state.empId);
  const schoolId = useAuthStore((state) => state.schoolId);
  const userId = useAuthStore((state) => state.userId);

  let type;
  if (role === 'principal' || role === 'principle') {
    type = 'staff';
  } else {
    type = 'student';
  }

  const isStudent = type === 'student';

  const [data, setData] = useState([]);

  // Dropdown lists and selections
  const [gradesList, setGradesList] = useState([]);
  const [classesList, setClassesList] = useState([]);
  const [sectionsList, setSectionsList] = useState([]);
  const [shiftsList, setShiftsList] = useState([]);

  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedShift, setSelectedShift] = useState(null);

  // Modals visibility
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);

  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isLoadingStaff, setIsLoadingStaff] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Format current date to YYYY-MM-DD
  const currentDateFormatted = new Date().toISOString().split('T')[0];
  const displayDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // 1. Fetch Grades on mount
  useEffect(() => {
    if (isStudent && empId) {
      getEmpAssignGradeList(empId)
        .then((res) => {
          if (res && res.success) {
            setGradesList(res.data || []);
            // if (res.data && res.data.length > 0) {
            //   setSelectedGrade(res.data[0]);
            // }
          }
        })
        .catch(err => console.error("Error fetching grades list:", err));
    }
  }, [isStudent, empId]);

  // 2. Fetch Classes when selectedGrade changes
  useEffect(() => {
    if (isStudent && schoolId && selectedGrade) {
      setClassesList([]);
      setSelectedClass(null);
      setSectionsList([]);
      setSelectedSection(null);

      getGradesByClasses(schoolId, selectedGrade.gradeId)
        .then((res) => {
          if (res && res.success) {
            setClassesList(res.data || []);
            // if (res.data && res.data.length > 0) {
            //   setSelectedClass(res.data[0]);
            // }
          }
        })
        .catch(err => console.error("Error fetching classes list:", err));
    }
  }, [isStudent, schoolId, selectedGrade]);

  // 3. Fetch Sections when selectedClass changes
  useEffect(() => {
    if (isStudent && schoolId && selectedClass && userId) {
      setSectionsList([]);
      setSelectedSection(null);

      getClassesBySection(schoolId, selectedClass.classId, userId)
        .then((res) => {
          if (res && res.success) {
            setSectionsList(res.data || []);
            // if (res.data && res.data.length > 0) {
            //   setSelectedSection(res.data[0]);
            // }
          }
        })
        .catch(err => Alert.alert("No Section found!"));
    }
  }, [isStudent, schoolId, selectedClass, userId]);

  // 4. Fetch Students list when selectedSection changes
  useEffect(() => {
    if (isStudent && schoolId && selectedClass && selectedSection) {
      setIsLoadingStudents(true);
      setIsSubmitted(false);
      const payload = {
        schoolId: Number(schoolId) || 0,
        sectionId: Number(selectedSection.sectionId) || 0,
        classId: Number(selectedClass.classId) || 0,
        attendanceDate: new Date().toISOString(),
        isOnRollStudents: false
      };

      getStudentForAttendance(payload)
        .then((res) => {
          if (res && res.success) {
            const apiStudents = res.data || [];

            const mapped = apiStudents.map(student => {
              const studentIdStr = String(student.studentId);

              return {
                id: studentIdStr,
                name: student.studentName || 'Unknown Student',
                subtitle: `Father: ${student.fatherName || 'N/A'} | Roll No: ${student.rollNumber || 'N/A'}`,
                status: student.attendanceStatusIdFk === '1' ? 'Present' : student.attendanceStatusIdFk === '2' ? 'Absent' : null,
                rawItem: student
              };
            });
            setData(mapped);

            // Check if all loaded students have a saved status
            const allSaved = mapped.length > 0 && mapped.every(s => s.status !== null);
            setIsSubmitted(allSaved);
          } else {
            setData([]);
            setIsSubmitted(false);
          }
        })
        .catch(err => {
          console.error("Error fetching students for attendance:", err);
          setData([]);
          setIsSubmitted(false);
        })
        .finally(() => setIsLoadingStudents(false));
    } else if (isStudent) {
      setData([]);
      setIsSubmitted(false);
    }
  }, [isStudent, schoolId, selectedClass, selectedSection, currentDateFormatted]);

  // 5. Fetch shifts on mount if isStudent is false
  useEffect(() => {
    if (!isStudent) {
      setIsLoadingStaff(true);
      getHRShift()
        .then((res) => {
          if (res && res.success) {
            setShiftsList(res.data || []);
            if (res.data && res.data.length > 0) {
              setSelectedShift(res.data[0]);
            }
          }
        })
        .catch(err => console.error("Error fetching shifts:", err))
        .finally(() => setIsLoadingStaff(false));
    }
  }, [isStudent]);

  // 6. Fetch employees when selectedShift changes (if !isStudent)
  useEffect(() => {
    if (!isStudent && schoolId && selectedShift) {
      setIsLoadingStaff(true);
      setIsSubmitted(false);
      console.log('Calling getEmployeesShift with:', {
        Date: currentDateFormatted,
        ShiftId: selectedShift.id,
        SchoolID: schoolId
      });
      getEmployeesShift(currentDateFormatted, selectedShift.id, schoolId)
        .then((res) => {
          if (res && res.success) {
            const apiEmployees = res.data || [];

            const mapped = apiEmployees.map(emp => {
              const empIdStr = String(emp.employeeId);

              return {
                id: empIdStr,
                name: emp.fullName || 'Unknown Staff',
                subtitle: `Code: ${emp.empCode || 'N/A'} | ${emp.departmentName || 'N/A'}`,
                status: null,
                rawItem: emp
              };
            });
            setData(mapped);
            setIsSubmitted(false);
          } else {
            setData([]);
            setIsSubmitted(false);
          }
        })
        .catch(err => {
          console.error("Error fetching employees shift:", err);
          setData([]);
          setIsSubmitted(false);
        })
        .finally(() => setIsLoadingStaff(false));
    } else if (!isStudent && !selectedShift) {
      setData([]);
      setIsSubmitted(false);
    }
  }, [isStudent, schoolId, selectedShift, currentDateFormatted]);

  const handleStatusChange = (id, newStatus) => {
    setData(prev => prev.map(person =>
      person.id === id ? { ...person, status: newStatus } : person
    ));
  };

  const markedCount = data.filter(s => s.status !== null).length;
  const isSubmitActive = markedCount === data.length && data.length > 0;

  const submitStudentAttendance = async () => {
    // Build API Request Body
    const getStatusId = (statusName) => {
      if (statusName === 'Present') return 1;
      if (statusName === 'Absent') return 2;
      return 0;
    };

    const apiPayload = {
      attendance: {
        userId: Number(userId) || 0,
        classId: Number(selectedClass?.classId) || 0,
        schoolId: Number(schoolId) || 0,
        sectionId: Number(selectedSection?.sectionId) || 0,
        attendanceDate: new Date().toISOString()
      },
      attendanceList: data.map(person => {
        const studentIdNum = Number(person.id) || Number(person.rawItem?.studentId) || 0;
        return {
          attendanceStatusId: getStatusId(person.status),
          studentId: studentIdNum
        };
      })
    };

    console.log('Submitting Student Attendance Payload', apiPayload);

    try {
      const apiRes = await markStudentsAttendance(apiPayload);
      if (apiRes && apiRes.success !== false) {
        setIsSubmitted(true);
        Alert.alert('Success', 'Student attendance submitted successfully.');
      } else {
        Alert.alert('Error', apiRes?.message || 'Failed to submit student attendance.');
      }
    } catch (error) {
      console.log('Failed to submit student attendance online:', error.message);
      Alert.alert('Submission Error', error.message || 'Failed to submit student attendance.');
    }
  };

  const submitStaffAttendance = async () => {
    // Build API Request payload only for present employees
    const presentEmployees = data
      .filter(person => person.status === 'Present')
      .map(person => ({
        employeeId: Number(person.id) || Number(person.rawItem?.employeeId) || Number(person.rawItem?.id) || 0,
        shiftId: Number(selectedShift?.id) || 0
      }));

    let payload = null;

    if (presentEmployees.length > 0) {
      payload = {
        userId: Number(userId) || 0,
        schoolId: Number(schoolId) || 0,
        attendanceDate: new Date().toISOString(),
        attendanceStatus: 1,
        employeeAttendance: presentEmployees
      };
    }

    console.log('Direct Submitting Staff Attendance Payload (Present Only):', JSON.stringify(payload, null, 2));

    try {
      if (payload) {
        const apiRes = await markEmployeeAttendance(payload);
        if (!apiRes || apiRes.success === false) {
          throw new Error(apiRes?.message || 'Failed to submit staff attendance.');
        }
      }
      setIsSubmitted(true);
      Alert.alert('Success', 'Staff attendance submitted successfully.');
    } catch (error) {
      console.log('Failed to submit staff attendance online:', error.message);
      Alert.alert('Submission Error', error.message || 'Failed to submit staff attendance.');
    }
  };

  const handleSubmit = async () => {
    if (!isSubmitActive || isSubmitted) return;

    if (isStudent) {
      await submitStudentAttendance();
    } else {
      await submitStaffAttendance();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        <HeroCard
          colors={theme.gradients.purple}
          topIcon="calendar"
          topLabel={isStudent ? "Mark Attendance" : "Today's Attendance"}
          title={displayDate}
          subtitle={`${markedCount} of ${data.length} marked`}
          rightActionText="History"
          onRightAction={() => navigation.navigate('AttendanceHistory', { type })}
        />

        {isStudent && (
          <View style={styles.rowDropdownContainer}>
            {/* Grade Selector */}
            <View style={styles.dropdownCol}>
              <Text style={styles.inputLabel}>Grade</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                activeOpacity={0.7}
                onPress={() => setShowGradeModal(true)}
              >
                <Text style={styles.dropdownButtonText} numberOfLines={1}>
                  {selectedGrade ? selectedGrade.gradeName : 'Select'}
                </Text>
                <Icon name="chevron-down" size={16} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Class Selector */}
            <View style={styles.dropdownCol}>
              <Text style={styles.inputLabel}>Class</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                activeOpacity={0.7}
                onPress={() => {
                  if (classesList.length > 0) setShowClassModal(true);
                  else Alert.alert('Notice', 'No classes available.');
                }}
              >
                <Text style={styles.dropdownButtonText} numberOfLines={1}>
                  {selectedClass ? selectedClass.className : 'Select'}
                </Text>
                <Icon name="chevron-down" size={16} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Section Selector */}
            <View style={styles.dropdownCol}>
              <Text style={styles.inputLabel}>Section</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                activeOpacity={0.7}
                onPress={() => {
                  if (sectionsList.length > 0) setShowSectionModal(true);
                  else Alert.alert('Notice', 'No sections available.');
                }}
              >
                <Text style={styles.dropdownButtonText} numberOfLines={1}>
                  {selectedSection ? selectedSection.sectionName : 'Select'}
                </Text>
                <Icon name="chevron-down" size={16} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!isStudent && (
          <View style={styles.rowDropdownContainer}>
            {/* Shift Selector */}
            <View style={styles.dropdownCol}>
              <Text style={styles.inputLabel}>Select Shift</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                activeOpacity={0.7}
                onPress={() => {
                  if (shiftsList.length > 0) setShowShiftModal(true);
                  else Alert.alert('Notice', 'No shifts available.');
                }}
              >
                <Text style={styles.dropdownButtonText} numberOfLines={1}>
                  {selectedShift ? selectedShift.name : 'Select'}
                </Text>
                <Icon name="chevron-down" size={16} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {(isLoadingStudents || isLoadingStaff) ? (
          <ActivityIndicator size="large" color={theme.colors.purple} style={{ marginTop: 40 }} />
        ) : (
          <View style={styles.listContainer}>
            {data.map((person) => (
              <AttendanceCard key={person.id} person={person} onStatusChange={handleStatusChange} disabled={isSubmitted} />
            ))}
          </View>
        )}

        {isSubmitted && (
          <View style={styles.submittedBadge}>
            <Icon name="check-circle" size={18} color="#10B981" />
            <Text style={styles.submittedBadgeText}>Attendance is Submitted for Today</Text>
          </View>
        )}

        {!isSubmitted && !(isLoadingStudents || isLoadingStaff) && data.length > 0 && (
          <TouchableOpacity
            style={[styles.submitBtn, isSubmitActive ? styles.submitBtnActive : styles.submitBtnInactive]}
            activeOpacity={0.8}
            onPress={handleSubmit}
            disabled={!isSubmitActive}
          >
            <Text style={[styles.submitBtnText, isSubmitActive ? styles.submitBtnTextActive : styles.submitBtnTextInactive]}>
              Submit Attendance
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Grade Selector Modal */}
      <Modal visible={showGradeModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowGradeModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Grade</Text>
            <FlatList
              data={gradesList}
              keyExtractor={(item) => String(item.gradeId)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedGrade(item);
                    setShowGradeModal(false);
                  }}
                >
                  <Text style={[styles.modalItemText, selectedGrade?.gradeId === item.gradeId && styles.modalItemTextSelected]}>
                    {item.gradeName}
                  </Text>
                  {selectedGrade?.gradeId === item.gradeId && <Icon name="check" size={20} color={theme.colors.linkPrimary} />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Class Selector Modal */}
      <Modal visible={showClassModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowClassModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Class</Text>
            <FlatList
              data={classesList}
              keyExtractor={(item) => String(item.classId)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedClass(item);
                    setShowClassModal(false);
                  }}
                >
                  <Text style={[styles.modalItemText, selectedClass?.classId === item.classId && styles.modalItemTextSelected]}>
                    {item.className}
                  </Text>
                  {selectedClass?.classId === item.classId && <Icon name="check" size={20} color={theme.colors.linkPrimary} />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Section Selector Modal */}
      <Modal visible={showSectionModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSectionModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Section</Text>
            <FlatList
              data={sectionsList}
              keyExtractor={(item) => String(item.sectionId)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedSection(item);
                    setShowSectionModal(false);
                  }}
                >
                  <Text style={[styles.modalItemText, selectedSection?.sectionId === item.sectionId && styles.modalItemTextSelected]}>
                    {item.sectionName}
                  </Text>
                  {selectedSection?.sectionId === item.sectionId && <Icon name="check" size={20} color={theme.colors.linkPrimary} />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Shift Selector Modal */}
      <Modal visible={showShiftModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowShiftModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Shift</Text>
            <FlatList
              data={shiftsList}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedShift(item);
                    setShowShiftModal(false);
                  }}
                >
                  <Text style={[styles.modalItemText, selectedShift?.id === item.id && styles.modalItemTextSelected]}>
                    {item.name}
                  </Text>
                  {selectedShift?.id === item.id && <Icon name="check" size={20} color={theme.colors.linkPrimary} />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    paddingTop: 10,
  },
  rowDropdownContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 16,
  },
  dropdownCol: {
    flex: 1,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  dropdownButtonText: {
    fontSize: 14,
    color: theme.colors.textHeading,
    flex: 1,
    marginRight: 4,
  },
  inputContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textBody,
    marginBottom: 8,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  inputText: {
    fontSize: 16,
    color: theme.colors.textHeading,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  submitBtn: {
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 12,
  },
  submitBtnInactive: {
    backgroundColor: '#E5E7EB',
  },
  submitBtnActive: {
    backgroundColor: theme.colors.linkPrimary,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitBtnTextInactive: {
    color: '#9CA3AF',
  },
  submitBtnTextActive: {
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '50%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  modalItemTextSelected: {
    color: theme.colors.linkPrimary,
    fontWeight: 'bold',
  },
  submittedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 12,
    gap: 8,
  },
  submittedBadgeText: {
    color: '#065F46',
    fontSize: 16,
    fontWeight: '600',
  }
});
