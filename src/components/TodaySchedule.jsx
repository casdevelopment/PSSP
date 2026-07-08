import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { theme } from '../theme/theme';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store/AuthStore';
import { getTeacherDailySchedule } from '../network/apis';

const getDayName = (dateStr) => {
  if (!dateStr) return '';
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const date = new Date(dateStr);
  console.log(date.getDay());
  return days[date.getDay()];
};

const TodaySchedule = () => {
  const navigation = useNavigation();
  const empId = useAuthStore((state) => state.empId);
  const schoolId = useAuthStore((state) => state.schoolId);

  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (empId) {
      setIsLoading(true);
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const todayFormatted = `${year}-${month}-${day}`;

      getTeacherDailySchedule(empId, todayFormatted)
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
  }, [empId]);

  const todayClasses = schedule;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Schedule</Text>
        <TouchableOpacity onPress={() => navigation.navigate('MySchedule')}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="small" color={theme.colors.purple} style={{ paddingVertical: 20 }} />
      ) : todayClasses.length === 0 ? (
        <Text style={{ color: theme.colors.textMuted, textAlign: 'center', paddingVertical: 10 }}>
          No classes scheduled for today
        </Text>
      ) : (
        <View style={styles.list}>
          {todayClasses.map((item, index) => {
            const timeRange = `${item.startTime} - ${item.endTime}`;
            const roomInfo = `Room ${item.roomNumber} (Floor ${item.floorNumber})`;
            return (
              <View
                key={index}
                style={[
                  styles.itemContainer,
                  index === todayClasses.length - 1 ? null : styles.itemMargin
                ]}
              >
                <Text style={styles.time}>{item.startTime || timeRange}</Text>
                <View style={styles.details}>
                  <Text style={styles.subject}>{item.subjectName}</Text>
                  <Text style={styles.teacher}>{roomInfo}</Text>
                  <Text style={styles.grade}>{item.gradeSection}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textHeading,
  },
  viewAll: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.linkPrimary,
  },
  list: {
    flexDirection: 'column',
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.appBackground,
    padding: 16,
    borderRadius: 16,
  },
  itemMargin: {
    marginBottom: 12,
  },
  time: {
    width: 85,
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.linkPrimary,
  },
  details: {
    flex: 1,
  },
  subject: {
    fontSize: 18,
    fontWeight: '500',
    color: theme.colors.textHeading,
    marginBottom: 4,
  },
  teacher: {
    fontSize: 15,
    color: theme.colors.textMuted,
    marginBottom: 2,
  },
  grade: {
    fontSize: 15,
    color: theme.colors.textMuted,
  }
});

export default TodaySchedule;
