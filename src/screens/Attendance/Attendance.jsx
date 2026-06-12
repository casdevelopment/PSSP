import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, TextInput, Alert, Modal, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';
import HeroCard from '../../components/HeroCard';
import AttendanceCard from '../../components/AttendanceCard';
import { useAuthStore } from '../../store/AuthStore';
import { saveStudentAttendance, saveStaffAttendance, getTodaysStudentAttendance, getTodaysStaffAttendance } from '../../utils/db';

const DUMMY_CLASSES = ['Grade 10-A', 'Grade 10-B', 'Grade 11-A', 'Grade 11-B', 'Grade 12-A'];

const initialStaffData = [
  { id: '1', name: 'John Smith', subtitle: 'Mathematics', status: null },
  { id: '2', name: 'Emma Wilson', subtitle: 'Physics', status: null },
  { id: '3', name: 'David Brown', subtitle: 'English', status: null },
  { id: '4', name: 'Sarah Lee', subtitle: 'Chemistry', status: null },
  { id: '5', name: 'Michael Chen', subtitle: 'Biology', status: null },
  { id: '6', name: 'Lisa Anderson', subtitle: 'History', status: null },
];

const initialStudentData = [
  { id: '101', name: 'Alice Johnson', subtitle: 'Roll No: 101', status: null },
  { id: '102', name: 'Bob Smith', subtitle: 'Roll No: 102', status: null },
  { id: '103', name: 'Charlie Davis', subtitle: 'Roll No: 103', status: null },
  { id: '104', name: 'Diana Wilson', subtitle: 'Roll No: 104', status: null },
  { id: '105', name: 'Ethan Brown', subtitle: 'Roll No: 105', status: null },
  { id: '106', name: 'Fiona Miller', subtitle: 'Roll No: 106', status: null },
  { id: '107', name: 'George Lee', subtitle: 'Roll No: 107', status: null },
  { id: '108', name: 'Hannah Taylor', subtitle: 'Roll No: 108', status: null },
];

export default function Attendance() {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const navigation = useNavigation();
  const role = useAuthStore((state) => state.role);
  
  let type;
  if (role === 'principal' || role === 'principle') {
    type = 'staff';
  }else {
    type = 'student';
  }
  
  const isStudent = type === 'student';

  const [data, setData] = useState(isStudent ? initialStudentData : initialStaffData);
  const [selectedClass, setSelectedClass] = useState(DUMMY_CLASSES[0]);
  const [showClassModal, setShowClassModal] = useState(false);
  
  // Format current date to YYYY-MM-DD
  const currentDateFormatted = new Date().toISOString().split('T')[0];
  const displayDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  useEffect(() => {
    // Reset data state before loading new attendance
    setData(isStudent ? initialStudentData : initialStaffData);
    loadTodaysAttendance();
  }, [type, selectedClass]);

  const loadTodaysAttendance = async () => {
    const savedRecords = isStudent 
      ? await getTodaysStudentAttendance(currentDateFormatted, selectedClass)
      : await getTodaysStaffAttendance(currentDateFormatted);

    if (savedRecords && savedRecords.length > 0) {
      setData(prev => prev.map(person => {
        const savedMatch = savedRecords.find(record => record.target_id === person.id);
        return savedMatch ? { ...person, status: savedMatch.status } : person;
      }));
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setData(prev => prev.map(person => 
      person.id === id ? { ...person, status: newStatus } : person
    ));
  };

  const markedCount = data.filter(s => s.status !== null).length;
  // User can only submit when ALL students or teachers are marked
  const isSubmitActive = markedCount === data.length && data.length > 0;

  const handleSubmit = async () => {
    if (!isSubmitActive) return;
    
    // Prepare records for DB
    const records = data.map(person => ({
      target_id: person.id,
      target_name: person.name,
      target_subtitle: person.subtitle || '',
      class_name: isStudent ? selectedClass : null,
      date: currentDateFormatted,
      status: person.status
    })).filter(r => r.status !== null); // only save those marked

    const success = isStudent 
      ? await saveStudentAttendance(records)
      : await saveStaffAttendance(records);

    if (success) {
      Alert.alert('Success', 'Attendance saved locally. It will be synced when online.');
    } else {
      Alert.alert('Error', 'Failed to save attendance.');
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
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Select Class</Text>
            <TouchableOpacity 
              style={styles.inputWrapper} 
              activeOpacity={0.7} 
              onPress={() => setShowClassModal(true)}
            >
              <Text style={styles.inputText}>{selectedClass}</Text>
              <Icon name="chevron-down" size={20} color={theme.colors.textMuted} />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.listContainer}>
          {data.map((person) => (
            <AttendanceCard key={person.id} person={person} onStatusChange={handleStatusChange} />
          ))}
        </View>

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
      </ScrollView>

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
              data={DUMMY_CLASSES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedClass(item);
                    setShowClassModal(false);
                  }}
                >
                  <Text style={[styles.modalItemText, selectedClass === item && styles.modalItemTextSelected]}>
                    {item}
                  </Text>
                  {selectedClass === item && <Icon name="check" size={20} color={theme.colors.linkPrimary} />}
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
  }
});
