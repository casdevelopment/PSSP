import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';
import Icon from 'react-native-vector-icons/Feather';

// Components
import HeroCard from '../../components/HeroCard';

const STUDENTS_DATA = [
  { id: '1', name: 'Alice Johnson', rollNo: '101', attendance: '96%', email: 'alice.j@school.edu', phone: '+1 555-1001' },
  { id: '2', name: 'Bob Smith', rollNo: '102', attendance: '92%', email: 'bob.s@school.edu', phone: '+1 555-1002' },
  { id: '3', name: 'Charlie Davis', rollNo: '103', attendance: '98%', email: 'charlie.d@school.edu', phone: '+1 555-1003' },
  { id: '4', name: 'Diana Wilson', rollNo: '104', attendance: '94%', email: 'diana.w@school.edu', phone: '+1 555-1004' },
  { id: '5', name: 'Ethan Brown', rollNo: '105', attendance: '90%', email: 'ethan.b@school.edu', phone: '+1 555-1005' },
  { id: '6', name: 'Fiona Miller', rollNo: '106', attendance: '95%', email: 'fiona.m@school.edu', phone: '+1 555-1006' },
];

function getAttendanceColor(attendanceStr) {
  const num = parseInt(attendanceStr);
  if (num >= 95) return '#16A34A'; // green
  if (num >= 90) return '#EA580C'; // orange/reddish
  return '#DC2626'; // red
}

export default function Students() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <HeroCard
          topLabel="Total Students"
          topIcon="users"
          title="6"
          subtitle="Across 4 classes"
          colors={['#2B7FFF', '#155DFC']}
        />

        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Select Class</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} editable={false} placeholder="e.g. Grade 10" placeholderTextColor={theme.colors.textMuted} />
          </View>
        </View>

        <View style={styles.listContainer}>
          {STUDENTS_DATA.map((student) => (
            <View key={student.id} style={styles.studentCard}>
              <View style={styles.cardHeader}>
                <View style={styles.nameWrap}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.rollNo}>Roll No: {student.rollNo}</Text>
                </View>
                <View style={styles.attendanceWrap}>
                  <Text style={styles.attendanceLabel}>Attendance</Text>
                  <Text style={[styles.attendanceValue, { color: getAttendanceColor(student.attendance) }]}>
                    {student.attendance}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.contactRow}>
                <Icon name="mail" size={16} color={theme.colors.textBody} />
                <Text style={styles.contactText}>{student.email}</Text>
              </View>
              <View style={styles.contactRow}>
                <Icon name="phone" size={16} color={theme.colors.textBody} />
                <Text style={styles.contactText}>{student.phone}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.appBackground || '#FAFAFA',
  },
  scrollContent: {
    paddingTop: 16,
  },
  filterSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    color: theme.colors.textHeading || '#0A0A0A',
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: theme.colors.white || '#FFF',
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle || '#E5E7EB',
    borderRadius: 12,
    height: 40,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  studentCard: {
    backgroundColor: theme.colors.white || '#FFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle || '#E5E7EB',
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
    color: theme.colors.textHeading || '#0A0A0A',
    marginBottom: 4,
  },
  rollNo: {
    fontSize: 14,
    color: theme.colors.linkPrimary || '#2B7FFF',
  },
  attendanceWrap: {
    alignItems: 'flex-end',
  },
  attendanceLabel: {
    fontSize: 14,
    color: theme.colors.textMuted || '#6B7280',
    marginBottom: 4,
  },
  attendanceValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.surfaceSubtle || '#F3F4F6',
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  contactText: {
    fontSize: 14,
    color: theme.colors.textBody || '#4A5565',
    marginLeft: 8,
  },
});