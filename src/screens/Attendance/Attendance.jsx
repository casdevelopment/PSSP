import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { theme } from '../../theme/theme';
import HeroCard from '../../components/HeroCard';
import AttendanceCard from '../../components/AttendanceCard';
import { useAuthStore } from '../../store/AuthStore';

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
  const role = useAuthStore((state) => state.role);
  
  // Determine if it is student or staff attendance
  const type = route.params?.type || (role === 'staff' ? 'student' : 'staff');
  const isStudent = type === 'student';

  const [data, setData] = useState(isStudent ? initialStudentData : initialStaffData);

  const handleStatusChange = (id, newStatus) => {
    setData(prev => prev.map(person => 
      person.id === id ? { ...person, status: newStatus } : person
    ));
  };

  const markedCount = data.filter(s => s.status !== null).length;
  const isSubmitActive = markedCount > 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topNav}>
          <Text style={styles.screenTitle}>{isStudent ? 'Student Attendance' : 'Staff Attendance'}</Text>
        </View>

        <HeroCard
          colors={theme.gradients.purple}
          topIcon="calendar"
          topLabel={isStudent ? "Mark Attendance" : "Today's Attendance"}
          title="April 30, 2026"
          subtitle={`${markedCount} of ${data.length} marked`}
          rightActionText="History"
          onRightAction={() => {}}
        />

        {isStudent && (
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Select Class</Text>
            <View style={styles.inputWrapper}>
              <TextInput style={styles.input} placeholder="" editable={false} />
            </View>
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
        >
          <Text style={[styles.submitBtnText, isSubmitActive ? styles.submitBtnTextActive : styles.submitBtnTextInactive]}>
            Submit Attendance
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    paddingTop: 60,
  },
  topNav: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000',
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
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
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
  }
});
