import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme/theme';

const notificationsData = [
  { id: '1', message: 'Salary for April has been credited', time: '2 hours ago' },
  { id: '2', message: 'Staff meeting scheduled for May 5', time: '5 hours ago' },
];

const RecentNotifications = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Notifications</Text>
        <TouchableOpacity>
          <Icon name="bell" size={20} color={theme.colors.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {notificationsData.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.itemContainer,
              index === notificationsData.length - 1 ? null : styles.itemMargin
            ]}
            activeOpacity={0.7}
          >
            <View style={styles.contentRow}>
              <View style={styles.dot} />
              <View style={styles.textContainer}>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={20} color={theme.colors.linkPrimary} />
          </TouchableOpacity>
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
    marginBottom: 16,
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
  list: {
    flexDirection: 'column',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F4F8FF', // Light blue background
    padding: 16,
    borderRadius: 16,
  },
  itemMargin: {
    marginBottom: 12,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.linkPrimary,
    marginTop: 6,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
  },
  message: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.textHeading,
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: theme.colors.textMuted,
  },
});

export default RecentNotifications;
