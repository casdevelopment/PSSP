import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import { theme } from '../../theme/theme';
import FullReportModal from '../../components/FullReportModal';

export default function StudentDetail() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const [isModalVisible, setModalVisible] = useState(false);

  // Retrieve the passed student data, fallback to Alice if none provided
  const student = route.params?.student || { 
    name: 'Alice Johnson', 
    rollNo: '101', 
    attendance: '96%', 
    email: 'alice.j@school.edu', 
    phone: '+1 555-1001' 
  };

  // Mock data mapping
  const TEST_SCORES = [
    { id: '1', subject: 'Mathematics', date: 'Apr 28, 2026', score: '95%' },
    { id: '2', subject: 'Physics', date: 'Apr 25, 2026', score: '92%' },
    { id: '3', subject: 'English', date: 'Apr 22, 2026', score: '96%' },
  ];

  const ATTENDANCE_HISTORY = [
    { id: '1', date: 'Apr 29', status: 'Present' },
    { id: '2', date: 'Apr 28', status: 'Present' },
    { id: '3', date: 'Apr 27', status: 'Late' },
    { id: '4', date: 'Apr 26', status: 'Present' },
    { id: '5', date: 'Apr 25', status: 'Present' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.linkPrimary} />

      {/* Header Background */}
      <View style={[styles.headerBg, { paddingTop: insets.top }]}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="chevron-left" size={24} color={theme.colors.white} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerTitles}>
          <Text style={styles.studentName}>{student.name}</Text>
          <Text style={styles.rollNo}>Roll No: {student.rollNo}</Text>
        </View>
      </View>

              {/* Top Stats Cards */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard,{ backgroundColor: theme.colors.blueSurface }]}>
            <View style={styles.statHeader}>
              <Icon name="calendar" size={16} color={theme.colors.linkPrimary} />
              <Text style={[styles.statLabel, { color: theme.colors.linkPrimary }]}>Attendance</Text>
            </View>
            <Text style={[styles.statValue, { color: theme.colors.linkPrimary }]}>{student.attendance}</Text>
          </View>
          
          <View style={[styles.statCard,{ backgroundColor: theme.colors.purpleSurface }]}>
            <View style={styles.statHeader}>
              <Icon name="award" size={16} color={theme.colors.accentPurple} />
              <Text style={[styles.statLabel, { color: theme.colors.accentPurple }]}>Performance</Text>
            </View>
            <Text style={[styles.statValue, { color: theme.colors.accentPurple }]}>94%</Text>
          </View>
        </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Contact Information */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={[styles.contactRow, { backgroundColor: theme.colors.appBackground }]}>
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.textOnDarkMuted }]}>
              <Icon name="mail" size={18} color={theme.colors.linkPrimary} />
            </View>
            <View>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>{student.email}</Text>
            </View>
          </View>
          
          <View style={[styles.contactRow, { backgroundColor: theme.colors.appBackground }]}>
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.successSubtle }]}>
              <Icon name="phone" size={18} color={theme.colors.successStrong} />
            </View>
            <View>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text style={styles.contactValue}>{student.phone}</Text>
            </View>
          </View>
        </View>

        {/* Parent Information */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Parent Information</Text>
          <View style={styles.parentRow}>
            <Text style={styles.parentLabel}>Parent Name</Text>
            <Text style={styles.parentValue}>Robert Johnson</Text>
          </View>
          <View style={[styles.parentRow, { borderBottomWidth: 0, marginBottom: 0 }]}>
            <Text style={styles.parentLabel}>Contact</Text>
            <Text style={styles.parentValue}>+1 555-2001</Text>
          </View>
        </View>

        {/* Recent Test Scores */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Recent Test Scores</Text>
          {TEST_SCORES.map((item) => (
            <View key={item.id} style={[styles.scoreRow, { backgroundColor: theme.colors.purpleSurface }]}>
              <View>
                <Text style={styles.scoreSubject}>{item.subject}</Text>
                <Text style={styles.scoreDate}>{item.date}</Text>
              </View>
              <View style={styles.scoreRight}>
                <Icon name="trending-up" size={16} color={theme.colors.accentPurple} style={{ marginRight: 6 }} />
                <Text style={[styles.scoreValue, { color: theme.colors.accentPurple }]}>{item.score}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Attendance History */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Attendance History</Text>
          {ATTENDANCE_HISTORY.map((item, index) => {
            const isPresent = item.status === 'Present';
            return (
              <View 
                key={item.id} 
                style={[
                  styles.historyRow,
                  index === ATTENDANCE_HISTORY.length - 1 ? { borderBottomWidth: 0, paddingBottom: 0 } : {}
                ]}
              >
                <Text style={styles.historyDate}>{item.date}</Text>
                <View style={[
                  styles.statusChip, 
                  { backgroundColor: isPresent ? theme.colors.successSubtle : theme.colors.warningSubtle }
                ]}>
                  <Text style={[
                    styles.statusChipText, 
                    { color: isPresent ? theme.colors.successStrong : theme.colors.warning }
                  ]}>
                    {item.status}
                  </Text>
                </View>
              </View>
            )
          })}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>Send Message</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.secondaryBtnText}>View Full Report</Text>
        </TouchableOpacity>
      </View>

      {/* Embedded Modal - Passing student object downward */}
      <FullReportModal 
        visible={isModalVisible} 
        onClose={() => setModalVisible(false)} 
        student={student}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  headerBg: {
    backgroundColor: theme.colors.linkPrimary,
    paddingBottom: 40, 
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  headerTitles: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  studentName: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.white,
    marginBottom: 4,
  },
  rollNo: {
    fontSize: 14,
    color: theme.colors.white80,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    marginTop: -30, 
  },
  statsRow: {
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: -20,
    marginBottom: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    padding: 20,
    ...theme.shadow.card,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    backgroundColor: theme.colors.appBackground,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  sectionCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textHeading,
    marginBottom: 16,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contactLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.textHeading,
  },
  parentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceSubtle,
  },
  parentLabel: {
    fontSize: 15,
    color: theme.colors.textMuted,
  },
  parentValue: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textHeading,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  scoreSubject: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textHeading,
    marginBottom: 4,
  },
  scoreDate: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  scoreRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceSubtle,
  },
  historyDate: {
    fontSize: 15,
    color: theme.colors.textBody,
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderSubtle,
    gap: 12,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: theme.colors.linkPrimary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: theme.colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: theme.colors.textBody,
    fontSize: 15,
    fontWeight: '600',
  },
});