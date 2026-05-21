import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme/theme';

// Components
import HeroCard from '../../components/HeroCard';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const TIMETABLE_DATA = [
  { id: '1', time: '9:00 AM', subject: 'Mathematics', teacher: 'John Smith', grade: 'Grade 10-A' },
  { id: '2', time: '10:30 AM', subject: 'Physics', teacher: 'Emma Wilson', grade: 'Grade 11-B' },
  { id: '3', time: '12:00 PM', empty: true },
  { id: '4', time: '1:30 PM', subject: 'English', teacher: 'David Brown', grade: 'Grade 9-C' },
  { id: '5', time: '3:00 PM', empty: true },
];

export default function Timetable() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [activeDay, setActiveDay] = useState('Monday');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.backgroundLight} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Custom Hero Card */}
        <View style={styles.heroWrapper}>
          <HeroCard
            topLabel="School Timetable"
            topIcon="calendar"
            title="Week Schedule"
            colors={theme.gradients.blue}
          />
        </View>

        {/* Days Horizontal Scroll */}
        <View style={styles.daysWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysScroll}>
            {DAYS.map((day) => {
              const isActive = activeDay === day;
              return (
                <TouchableOpacity 
                  key={day}
                  style={[styles.dayPill, isActive ? styles.dayPillActive : styles.dayPillInactive]}
                  onPress={() => setActiveDay(day)}
                >
                  <Text style={[styles.dayText, isActive ? styles.dayTextActive : styles.dayTextInactive]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Schedule List */}
        <View style={styles.listContainer}>
          {TIMETABLE_DATA.map((item) => {
            if (item.empty) {
              return (
                <View key={item.id} style={styles.emptyCard}>
                  <Text style={styles.timeText}>{item.time}</Text>
                  <Text style={styles.emptyText}>No class scheduled</Text>
                </View>
              );
            }

            return (
              <TouchableOpacity 
                key={item.id} 
                style={styles.classCard}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('ClassDetails', { grade: item.grade, subject: item.subject })}
              >
                <Text style={styles.timeText}>{item.time}</Text>
                <Text style={styles.subjectText}>{item.subject}</Text>
                <Text style={styles.teacherText}>{item.teacher}</Text>
                <Text style={styles.gradeText}>{item.grade}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  scrollContent: {
    paddingBottom: 100,
    paddingTop: 16,
  },
  heroWrapper: {
    // HeroCard has its own padding
  },
  daysWrapper: {
    marginBottom: 20,
  },
  daysScroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
  dayPill: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  dayPillActive: {
    backgroundColor: theme.colors.linkPrimary,
  },
  dayPillInactive: {
    backgroundColor: theme.colors.white,
  },
  dayText: {
    fontSize: 15,
    fontWeight: '600',
  },
  dayTextActive: {
    color: theme.colors.white,
  },
  dayTextInactive: {
    color: theme.colors.textBody,
  },
  listContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  classCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  emptyCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.linkPrimary,
    marginBottom: 8,
  },
  subjectText: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textHeading,
    marginBottom: 4,
  },
  teacherText: {
    fontSize: 14,
    color: theme.colors.textBody,
    marginBottom: 2,
  },
  gradeText: {
    fontSize: 14,
    color: theme.colors.textMuted,
  },
  emptyText: {
    fontSize: 15,
    fontStyle: 'italic',
    color: theme.colors.textMuted,
  },
});