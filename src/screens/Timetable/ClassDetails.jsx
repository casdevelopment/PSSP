import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';

// Demo data (replace later with API response / store / props)
const DEMO_CLASS_DETAILS = {
  stats: {
    students: 45,
    room: 201,
    subjectsCount: 5,
  },
  teacher: {
    name: 'John Smith',
    role: 'Mathematics Teacher',
  },
  subjects: ['Mathematics', 'Physics', 'English', 'Chemistry', 'Biology'],
  weeklySchedule: [
    { day: 'Monday', items: ['Math', 'Physics', 'English', 'Chemistry'] },
    { day: 'Tuesday', items: ['Biology', 'Math', 'English', 'Physics'] },
    { day: 'Wednesday', items: ['Chemistry', 'Biology', 'Math', 'English'] },
  ],
  topStudents: [
    { id: '1', name: 'Alice Johnson', roll: '101', score: '96%' },
    { id: '2', name: 'Bob Smith', roll: '102', score: '94%' },
    { id: '3', name: 'Charlie Davis', roll: '103', score: '92%' },
  ],
};

export default function ClassDetails() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();

  const grade = route.params?.grade || 'Grade 10-A';

  // Demo-driven UI data (no hard-coded UI strings scattered in JSX)
  const classDetails = useMemo(() => {
    // later: pick by grade/classId from route params
    return DEMO_CLASS_DETAILS;
  }, [grade]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.purple} />

      {/* Purple Header */}
      <View style={[styles.headerBg, { paddingTop: insets.top }]}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="chevron-left" size={24} color={theme.colors.white} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerTitles}>
          <Text style={styles.pageTitle}>{grade}</Text>
          <Text style={styles.pageSubtitle}>Class Details</Text>
        </View>
      </View>

      {/* Floating Stats Card */}
      <View style={[styles.statsCard, theme.shadow.card]}>
        <View style={styles.statCol}>
          <View style={[styles.iconWrapper, { backgroundColor: theme.colors.blueSurface }]}>
            <Icon name="users" size={20} color={theme.colors.linkPrimary} />
          </View>
          <Text style={[styles.statValue, { color: theme.colors.linkPrimary }]}>
            {classDetails.stats.students}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.linkPrimary }]}>Students</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statCol}>
          <View style={[styles.iconWrapper, { backgroundColor: theme.colors.greenSurface }]}>
            <Icon name="map-pin" size={20} color={theme.colors.successStrong} />
          </View>
          <Text style={[styles.statValue, { color: theme.colors.successStrong }]}>
            {classDetails.stats.room}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.successStrong }]}>Room</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statCol}>
          <View style={[styles.iconWrapper, { backgroundColor: theme.colors.purpleSurface }]}>
            <Icon name="book-open" size={20} color={theme.colors.accentPurple} />
          </View>
          <Text style={[styles.statValue, { color: theme.colors.accentPurple }]}>
            {classDetails.stats.subjectsCount}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.accentPurple }]}>Subjects</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Class Teacher */}
        <View style={styles.scheduleCard}>
          <Text style={styles.sectionTitle}>Class Teacher</Text>
          <View style={styles.teacherCard}>
            <View style={[styles.teacherIcon, { backgroundColor: theme.colors.blueSurface }]}>
              <Icon name="user" size={20} color={theme.colors.linkPrimary} />
            </View>
            <View>
              <Text style={styles.teacherName}>{classDetails.teacher.name}</Text>
              <Text style={styles.teacherRole}>{classDetails.teacher.role}</Text>
            </View>
          </View>
        </View>

        {/* Subjects */}
        <View style={styles.scheduleCard}>
          <Text style={styles.sectionTitle}>Subjects</Text>
          <View style={styles.subjectsContainer}>
            {classDetails.subjects.map((sub, idx) => (
              <View key={`${sub}-${idx}`} style={styles.subjectPill}>
                <Text style={styles.subjectPillText}>{sub}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Weekly Schedule */}
        <View style={styles.scheduleCard}>
          <Text style={styles.sectionTitle}>Weekly Schedule</Text>

          {classDetails.weeklySchedule.map((block) => (
            <View key={block.day}>
              <Text style={styles.scheduleDay}>{block.day}</Text>
              <View style={styles.scheduleRow}>
                {block.items.map((item, idx) => (
                  <View key={`${block.day}-${item}-${idx}`} style={styles.schedulePill}>
                    <Text style={styles.schedulePillText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Top Students */}
        <View style={styles.scheduleCard}>
          <Text style={styles.sectionTitle}>Top Students</Text>

          {classDetails.topStudents.map((student) => (
            <View key={student.id} style={styles.studentsCard}>
              <View style={styles.studentRow}>
                <View>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.studentRoll}>Roll No: {student.roll}</Text>
                </View>
                <Text style={styles.studentScore}>{student.score}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.8}>
          <Text style={styles.primaryBtnText}>View Timetable</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.8}>
          <Text style={styles.secondaryBtnText}>View Students</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  headerBg: {
    backgroundColor: theme.colors.purple,
    paddingBottom: 60,
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
    marginTop: 8,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.white,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 16,
    color: theme.colors.white90,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    marginTop: 10,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginHorizontal: 16,
    marginTop: -30,
    marginBottom: 14,
    justifyContent: 'space-evenly',
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.borderSubtle,
    height: '80%',
    alignSelf: 'center',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textHeading,
    marginBottom: 12,
  },
  teacherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.blueSurface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 4,
  },
  teacherIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  teacherName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textHeading,
    marginBottom: 2,
  },
  teacherRole: {
    fontSize: 14,
    color: theme.colors.textBody,
  },
  subjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 4,
  },
  subjectPill: {
    backgroundColor: theme.colors.purpleSurface,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  subjectPillText: {
    color: theme.colors.accentPurple,
    fontSize: 14,
    fontWeight: '600',
  },
  scheduleCard: {
    backgroundColor: theme.colors.white,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    marginBottom: 18,
  },
  scheduleDay: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.linkPrimary,
    marginBottom: 10,
  },
  scheduleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  schedulePill: {
    backgroundColor: theme.colors.surfaceSubtle,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  schedulePillText: {
    color: theme.colors.textBody,
    fontSize: 13,
    fontWeight: '500',
  },
  studentsCard: {
    backgroundColor: theme.colors.greenSurface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  studentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 4,
    marginBottom: 4,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textHeading,
    marginBottom: 2,
  },
  studentRoll: {
    fontSize: 13,
    color: theme.colors.textBody,
  },
  studentScore: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.successStrong,
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