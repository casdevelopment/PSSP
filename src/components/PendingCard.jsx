import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { theme } from '../theme/theme';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store/AuthStore';
import { getUnapprovedStaffLeaveRequest, getUnapprovedPrincipalLeaveRequest } from '../network/apis';

const PendingCard = () => {
  const navigation = useNavigation();
  const schoolId = useAuthStore((state) => state.schoolId);
  const empId = useAuthStore((state) => state.empId);
  const userType = useAuthStore((state) => state.userType);

  const [leaveRequestsData, setLeaveRequestsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchPendingLeaves = async () => {
      try {
        setIsLoading(true);
        let response = null;
        if (userType === 'coordinator') {
          response = await getUnapprovedPrincipalLeaveRequest(empId).catch(err => {
            if (err.response?.status === 404 || err.message?.includes('404')) {
              return { success: true, data: [] };
            }
            throw err;
          });
        } else if (userType === 'principal') {
          response = await getUnapprovedStaffLeaveRequest(schoolId).catch(err => {
            if (err.response?.status === 404 || err.message?.includes('404')) {
              return { success: true, data: [] };
            }
            throw err;
          });
        }

        if (isMounted) {
          if (response && response.success) {
            const rawData = response.data || [];
            const mapped = rawData.map(item => {
              const days = item.days || 1;
              return {
                id: String(item.id),
                name: item.firstName || item.employeeName || item.empName || item.name || 'Staff Member',
                type: item.leaveTypeName || item.entityLeaveType || item.leaveType || 'Leave',
                duration: `${days} day${days > 1 ? 's' : ''}`,
              };
            });
            setLeaveRequestsData(mapped);
          } else {
            setLeaveRequestsData([]);
          }
        }
      } catch (error) {
        console.error('Error fetching pending leaves in PendingCard:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPendingLeaves();

    return () => {
      isMounted = false;
    };
  }, [userType, schoolId, empId]);

  const displayedRequests = leaveRequestsData.slice(0, 3);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pending Leave Requests</Text>
        <TouchableOpacity onPress={() => navigation.navigate('LeaveRequestsManagement')}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {isLoading ? (
          <ActivityIndicator size="small" color={theme.colors.purple} style={styles.loader} />
        ) : displayedRequests.length > 0 ? (
          displayedRequests.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.itemContainer,
                index === displayedRequests.length - 1 ? null : styles.itemMargin
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
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No pending leave requests</Text>
          </View>
        )}
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
  },
  loader: {
    paddingVertical: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontSize: 15,
  }
});

export default PendingCard;
