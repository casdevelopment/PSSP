import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';
import { useNavigation } from '@react-navigation/native';

const leaveRequestsData = [
  { id: '1', name: 'John Smith', type: 'Sick Leave', duration: '2 days' },
  { id: '2', name: 'Emma Wilson', type: 'Personal', duration: '1 day' },
  { id: '3', name: 'Sarah Lee', type: 'Casual', duration: '1 day' },
];

const PendingCard = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pending Leave Requests</Text>
        <TouchableOpacity onPress={() => navigation.navigate('LeaveRequestsManagement')}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {leaveRequestsData.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.itemContainer,
              index === leaveRequestsData.length - 1 ? null : styles.itemMargin
            ]}
          >
            <View style={styles.details}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.type}>{item.type}</Text>
              <Text style={styles.duration}>{item.duration}</Text>
            </View>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>Pending</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.approvalCardBg,
    padding: 16,
    borderRadius: 16,
  },
  itemMargin: {
    marginBottom: 12,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
    color: theme.colors.textHeading,
    marginBottom: 4,
  },
  type: {
    fontSize: 15,
    color: theme.colors.textMuted,
    marginBottom: 2,
  },
  duration: {
    fontSize: 15,
    color: theme.colors.textMuted,
  },
  badgeContainer: {
    backgroundColor: theme.colors.pendingChipBg,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  badgeText: {
    color: theme.colors.pendingChipText,
    fontSize: 14,
    fontWeight: '600',
  }
});

export default PendingCard;
