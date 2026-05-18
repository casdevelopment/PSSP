import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme/theme';

const getStatusColor = (status) => {
  if (status === 'Pending') return { bg: '#FFEDD4', text: '#EA580C' };
  if (status === 'Approved') return { bg: '#D1FAE5', text: '#059669' };
  return { bg: '#F3F4F6', text: '#6B7280' };
};

export default function LeaveRequestCard({ request, onPress }) {
  const statusStyle = getStatusColor(request.status);

  return (
    <TouchableOpacity style={styles.requestCard} onPress={onPress}>
      <View style={styles.requestHeader}>
        <View style={styles.typeTag}>
          <Text style={styles.typeText}>{request.type}</Text>
        </View>

        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>{request.status}</Text>
          </View>

          <Icon name="chevron-right" size={20} color={theme.colors.borderSubtle} style={{ marginLeft: 8 }} />
        </View>
      </View>

      <Text style={styles.appliedDate}>Applied on {request.appliedDate}</Text>

      <View style={styles.requestDetails}>
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>Duration</Text>
          <Text style={styles.detailValue}>{request.duration}</Text>
        </View>

        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>Period</Text>
          <Text style={styles.detailValue}>{request.period}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  requestCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  typeTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  typeText: {
    color: theme.colors.linkPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  appliedDate: {
    fontSize: 14,
    color: theme.colors.textBody,
    marginBottom: 16,
  },
  requestDetails: {
    flexDirection: 'row',
    gap: 32,
  },
  detailBox: {
    flexDirection: 'column',
  },
  detailLabel: {
    fontSize: 13,
    color: '#6A7282',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0A0A0A',
  },
});
