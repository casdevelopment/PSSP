import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme/theme';
import Icon from 'react-native-vector-icons/Feather';
import { useAuthStore } from '../../store/AuthStore';
import { getEmpAssignGradeList, getGradesByClasses, getEmployeeAssignedClassesStudents } from '../../network/apis';

// Components
import HeroCard from '../../components/HeroCard';

export default function Students() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  const empId = useAuthStore((state) => state.empId);
  const schoolId = useAuthStore((state) => state.schoolId);

  const [gradesList, setGradesList] = useState([]);
  const [classesList, setClassesList] = useState([]);
  
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Fetch Grades on mount
  useEffect(() => {
    if (empId) {
      getEmpAssignGradeList(empId)
        .then((res) => {
          if (res && res.success) {
            setGradesList(res.data || []);
          }
        })
        .catch(err => console.error("Error fetching grades list:", err));
    }
  }, [empId]);

  // 2. Fetch Classes when selectedGrade changes
  useEffect(() => {
    if (schoolId && selectedGrade) {
      setClassesList([]);
      setSelectedClass(null);
      setStudents([]);

      getGradesByClasses(schoolId, selectedGrade.gradeId)
        .then((res) => {
          if (res && res.success) {
            setClassesList(res.data || []);
          }
        })
        .catch(err => console.error("Error fetching classes list:", err));
    }
  }, [schoolId, selectedGrade]);

  // 3. Fetch Students when selectedClass changes
  useEffect(() => {
    if (schoolId && empId && selectedClass) {
      setIsLoading(true);
      getEmployeeAssignedClassesStudents(schoolId, empId, selectedClass.classId)
        .then((res) => {
          if (res && res.success) {
            setStudents(res.data || []);
          } else {
            setStudents([]);
          }
        })
        .catch(err => {
          console.error("Error fetching students:", err);
          setStudents([]);
        })
        .finally(() => setIsLoading(false));
    } else {
      setStudents([]);
    }
  }, [schoolId, empId, selectedClass]);

  const renderHeader = () => (
    <View>
      <HeroCard
        topLabel="Total Students"
        topIcon="users"
        title={students.length.toString()}
        subtitle={selectedClass ? `In ${selectedClass.className}` : "Select grade and class to view"}
        colors={[theme.colors.bluePrimary, theme.colors.linkPrimary]}
      />

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
      </View>

      {isLoading && (
        <ActivityIndicator size="large" color={theme.colors.linkPrimary} style={{ marginTop: 40, marginBottom: 20 }} />
      )}

      {!isLoading && students.length === 0 && (
        <View style={styles.centered}>
          <Icon name="users" size={48} color={theme.colors.textMuted} style={styles.emptyIcon} />
          <Text style={styles.emptyText}>No students found</Text>
          <Text style={styles.emptySubtitle}>
            {!selectedGrade ? "Select a grade to start" : !selectedClass ? "Select a class to view students" : "No students assigned to this class"}
          </Text>
        </View>
      )}
    </View>
  );

  const renderStudentItem = ({ item: student }) => (
    <View style={{ paddingHorizontal: 16 }}>
      <TouchableOpacity 
        style={styles.studentCard}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('StudentDetail', { student })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.nameWrap}>
            <Text style={styles.studentName}>{student.studentName}</Text>
            <Text style={styles.rollNo}>Roll No: {student.rollNumber || 'N/A'}</Text>
          </View>
          <View style={styles.sectionWrap}>
            <Text style={styles.sectionLabel}>Section</Text>
            <Text style={styles.sectionValue}>
              {student.sectionName || 'N/A'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.contactRow}>
          <Icon name="user" size={16} color={theme.colors.textBody} />
          <Text style={styles.contactText}>Father: {student.fatherName || 'N/A'}</Text>
        </View>
        <View style={styles.contactRow}>
          <Icon name="phone" size={16} color={theme.colors.textBody} />
          <Text style={styles.contactText}>Phone: {student.guardianPhoneNumber || 'N/A'}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={isLoading ? [] : students}
        renderItem={renderStudentItem}
        keyExtractor={(item) => String(item.studentId)}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      />

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  scrollContent: {
    paddingTop: 16,
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
    backgroundColor: theme.colors.white,
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
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textBody,
    marginBottom: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  studentCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  nameWrap: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textHeading,
    marginBottom: 4,
  },
  rollNo: {
    fontSize: 14,
    color: theme.colors.bluePrimary,
  },
  sectionWrap: {
    alignItems: 'flex-end',
  },
  sectionLabel: {
    fontSize: 14,
    color: theme.colors.textMutedAlt,
    marginBottom: 4,
  },
  sectionValue: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.bluePrimary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.surfaceSubtle,
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  contactText: {
    fontSize: 14,
    color: theme.colors.textBody,
    marginLeft: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textHeading,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.textMuted,
    textAlign: 'center',
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
});