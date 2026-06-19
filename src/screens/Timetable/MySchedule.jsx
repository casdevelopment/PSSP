import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../../theme/theme';
import { useAuthStore } from '../../store/AuthStore';
import { getTeacherDailySchedule } from '../../network/apis';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const getDayName = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return DAYS_OF_WEEK[date.getDay()];
};

const getDateForDayName = (dayName) => {
  const dayIndices = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };
  const targetIndex = dayIndices[dayName];

  const today = new Date();
  const currentDayIndex = today.getDay(); // 0-6

  // Calculate difference from today to target index
  const diff = targetIndex - currentDayIndex;

  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + diff);

  // Format to YYYY-MM-DD
  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function MySchedule() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // Get current day name and select it initially if it is Mon-Fri, else default to 'Monday'
  const initialDay = (() => {
    const currentDay = getDayName(new Date());
    return DAYS_OF_WEEK.includes(currentDay) ? currentDay : 'Monday';
  })();

  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const empId = useAuthStore((state) => state.empId);

  useEffect(() => {
    if (empId) {
      setIsLoading(true);
      const selectedDate = getDateForDayName(selectedDay);
      getTeacherDailySchedule(empId, selectedDate)
        .then((res) => {
          if (res && res.success) {
            setSchedule(res.data || []);
          } else {
            setSchedule([]);
          }
        })
        .catch((err) => {
          console.log('No schedule found or error fetching schedule:', err.message);
          setSchedule([]);
        })
        .finally(() => setIsLoading(false));
    }
  }, [empId, selectedDay]);

  const countLabel = `${schedule.length} class${schedule.length !== 1 ? 'es' : ''} scheduled`;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Main Container Header */}
      <View style={styles.headerContainer}>
        {/* Blue Header Gradient */}
        <LinearGradient
          colors={theme.gradients.blue}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.headerBg, { paddingTop: insets.top + theme.spacing.xs }]}
        >
          <View style={styles.headerTopRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Icon name="chevron-left" size={24} color={theme.colors.white} />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.headerTitlesContainer}>
            <View style={styles.iconCircle}>
              <Icon name="calendar" size={22} color={theme.colors.white} />
            </View>
            <View style={styles.titleTextGroup}>
              <Text style={styles.pageTitle}>My Schedule</Text>
              <Text style={styles.pageSubtitle}>Weekly timetable</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Horizontal Days Selector - Positioned to cleanly cross the background border */}
        <View style={styles.daysContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daysScrollContainer}
          >
            {DAYS_OF_WEEK.map((day) => {
              const isSelected = selectedDay === day;
              return (
                <TouchableOpacity
                  key={day}
                  activeOpacity={0.8}
                  onPress={() => setSelectedDay(day)}
                  style={[
                    styles.dayPill,
                    isSelected ? styles.dayPillActive : styles.dayPillInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayPillText,
                      isSelected ? styles.dayPillTextActive : styles.dayPillTextInactive,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* Main Content Area */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + theme.spacing.xxl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Schedule Card Container */}
        <View style={styles.mainScheduleCard}>
          <Text style={styles.dayHeading}>{selectedDay}</Text>
          <Text style={styles.classCountLabel}>{countLabel}</Text>

          {/* Cards List */}
          <View style={styles.itemsListContainer}>
            {isLoading ? (
              <ActivityIndicator size="small" color={theme.colors.purple} style={{ paddingVertical: 20 }} />
            ) : schedule.length === 0 ? (
              <Text style={{ color: theme.colors.textMuted, textAlign: 'center', paddingVertical: 20 }}>
                No classes scheduled for {selectedDay}
              </Text>
            ) : (
              schedule.map((item, index) => {
                const timeRange = `${item.startTime} - ${item.endTime}`;
                const roomInfo = `Room ${item.roomNumber || 'N/A'}`;
                return (
                  <View
                    key={index}
                    activeOpacity={0.7}
                    style={[styles.classItemCard, { backgroundColor: theme.colors.blueSurface }]}
                  // onPress={() => navigation.navigate('ClassDetails', { grade: item.gradeSection })}
                  >
                    <View style={styles.itemTopRow}>
                      <View style={styles.timeGroup}>
                        <Icon name="clock" size={14} color={theme.colors.linkPrimary} style={styles.clockIcon} />
                        <Text style={styles.itemTimeText}>{item.startTime || timeRange}</Text>
                      </View>
                      <View style={[styles.roomBadge, { backgroundColor: theme.colors.textOnDarkMuted }]}>
                        <Text style={styles.roomBadgeText}>{roomInfo}</Text>
                      </View>
                    </View>

                    <View style={styles.itemBottomRow}>
                      <View style={styles.detailsGroup}>
                        <Text style={styles.subjectTitle}>{item.subjectName}</Text>
                        <Text style={styles.gradeSubtitle}>{item.gradeSection}</Text>
                      </View>
                      {/* <Icon name="chevron-right" size={18} color={theme.colors.textMuted} /> */}
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </View>

        {/* <View style={styles.summaryContainerCard}>
          <Text style={styles.summaryTitle}>Weekly Summary</Text>
          <View style={styles.summaryWidgetsRow}>
            <View style={[styles.summaryWidgetBox, { backgroundColor: theme.colors.blueSurface }]}>
              <Text style={[styles.widgetLabel, { color: theme.colors.linkPrimary }]}>Total Classes</Text>
              <Text style={[styles.widgetValue, { color: theme.colors.linkPrimary }]}>15</Text>
            </View>

            <View style={[styles.summaryWidgetBox, { backgroundColor: theme.colors.greenSurface }]}>
              <Text style={[styles.widgetLabel, { color: theme.colors.successStrong }]}>Total Students</Text>
              <Text style={[styles.widgetValue, { color: theme.colors.successStrong }]}>142</Text>
            </View>
          </View>
        </View> */}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  headerContainer: {
    backgroundColor: 'transparent',
    paddingBottom: 24, // Generates empty bottom clearance space for the absolute pills
  },
  headerBg: {
    paddingBottom: 40, // Expanded height room to match visual balance
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xxs,
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
  headerTitlesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    marginTop: theme.spacing.sm,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  titleTextGroup: {
    justifyContent: 'center',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.white,
    marginBottom: 2,
  },
  pageSubtitle: {
    fontSize: 14,
    color: theme.colors.white80,
  },
  daysContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  daysScrollContainer: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.xs,
    paddingVertical: 4, // Prevents custom outer shadow cutoff bounds
  },
  dayPill: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  dayPillActive: {
    backgroundColor: theme.colors.linkPrimary,
  },
  dayPillInactive: {
    backgroundColor: theme.colors.white,
  },
  dayPillText: {
    fontSize: 15,
    fontWeight: '600',
  },
  dayPillTextActive: {
    color: theme.colors.white,
  },
  dayPillTextInactive: {
    color: theme.colors.textBody,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  mainScheduleCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  dayHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textStrong,
    marginBottom: 4,
  },
  classCountLabel: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xl,
  },
  itemsListContainer: {
    gap: theme.spacing.md,
  },
  classItemCard: {
    borderRadius: 14,
    padding: theme.spacing.md,
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  timeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockIcon: {
    marginRight: 6,
  },
  itemTimeText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.linkPrimary,
  },
  roomBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roomBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.linkPrimary,
  },
  itemBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailsGroup: {
    flex: 1,
  },
  subjectTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textHeading,
    marginBottom: 4,
  },
  gradeSubtitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  summaryContainerCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textHeading,
    marginBottom: theme.spacing.md,
  },
  summaryWidgetsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  summaryWidgetBox: {
    flex: 1,
    borderRadius: 12,
    padding: theme.spacing.md,
  },
  widgetLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  widgetValue: {
    fontSize: 26,
    fontWeight: '800',
  },
});