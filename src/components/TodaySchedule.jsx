import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';
import { useNavigation } from '@react-navigation/native';

const scheduleData = [
  { id: '1', time: '9:00 AM', subject: 'Mathematics', teacher: 'John Smith', grade: 'Grade 10-A' },
  { id: '2', time: '10:30 AM', subject: 'Physics', teacher: 'Emma Wilson', grade: 'Grade 11-B' },
  { id: '3', time: '1:00 PM', subject: 'English', teacher: 'David Brown', grade: 'Grade 9-C' },
];

const TodaySchedule = () => {

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Schedule</Text>
        <TouchableOpacity onPress={() => navigation.navigate('MySchedule')}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.list}>
        {scheduleData.map((item, index) => (
          <View 
            key={item.id} 
            style={[
              styles.itemContainer, 
              index === scheduleData.length - 1 ? null : styles.itemMargin 
            ]}
          >
            <Text style={styles.time}>{item.time}</Text>
            <View style={styles.details}>
              <Text style={styles.subject}>{item.subject}</Text>
              <Text style={styles.teacher}>{item.teacher}</Text>
              <Text style={styles.grade}>{item.grade}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: 16,
    marginTop: 16,
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
