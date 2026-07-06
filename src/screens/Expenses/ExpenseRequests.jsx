import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';
import { useAuthStore } from '../../store/AuthStore';
import { getExpensePendingListSchool } from '../../network/apis';

// Components
import HeroCard from '../../components/HeroCard';
import CalendarPickerModal from '../../components/CalendarPickerModal';
import HeaderPlusButton from '../../components/HeaderPlusButton';
import AddExpenseModel from '../../components/AddExpenseModel';

const formatDateString = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

export default function ExpenseRequests() {
  const navigation = useNavigation();
  const empId = useAuthStore((state) => state.empId);
  const role = useAuthStore((state) => state.userType);

  const todayDate = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(todayDate.getDate() - 30);

  const [fromDate, setFromDate] = useState(formatDateString(thirtyDaysAgo));
  const [toDate, setToDate] = useState(formatDateString(todayDate));
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (role === 'principal') {
      navigation.setOptions({
        headerRight: () => (
          <HeaderPlusButton onPress={() => setIsAddModalVisible(true)} />
        ),
      });
    }
  }, [navigation, role]);

  const fetchExpenses = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setIsLoading(true);
      setError(null);
      const response = await getExpensePendingListSchool(empId, fromDate, toDate).catch(err => {
        if (err.response?.status === 404 || err.message?.includes('404')) {
          return { success: true, data: [] };
        }
        console.error('Error fetching expenses:', err);
        return null;
      });

      if (response && response.success) {
        const rawData = response.data || [];
        const mapped = rawData.map(item => ({
          id: String(item.expID),
          title: `Expense Request #${item.expID}`,
          school: item.schoolName || 'Unknown School',
          amount: `PKR ${Number(item.amount).toLocaleString()}`,
          amountRaw: item.amount,
          status: item.isDeleted ? 'Rejected' : (item.isPosted ? 'Approved' : 'Pending'),
          date: formatDate(item.expAddedDate),
          rawItem: item
        }));
        setExpenses(mapped);
      } else {
        setError(response?.message || 'Failed to load expense requests');
      }
    } catch (err) {
      console.error('Error in fetchExpenses:', err);
      setError(err.message || 'An error occurred while loading expenses');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [empId, fromDate, toDate]);

  useEffect(() => {
    fetchExpenses(true);
  }, [fetchExpenses]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchExpenses(false);
  };

  const pendingCount = expenses.filter(e => e.status === 'Pending').length;
  const totalAmount = expenses.reduce((sum, item) => sum + (Number(item.amountRaw) || 0), 0);

  if (isLoading && !isRefreshing && expenses.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.purple} />
        <Text style={styles.loadingText}>Loading expense requests...</Text>
      </View>
    );
  }

  if (error && expenses.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-triangle" size={48} color={theme.colors.danger} />
        <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
        <Text style={styles.errorSubTitle}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchExpenses(true)}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.backgroundLight} />


      {/* Custom Hero Card for Pending Approvals */}
      <View style={styles.heroWrapper}>
        <HeroCard
          topLabel="Pending Approval"
          topIcon="file-text"
          title={String(pendingCount)}
          subtitle={`Total: PKR ${totalAmount.toLocaleString()}`}
          colors={theme.gradients.darkOrange}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.purple]}
            tintColor={theme.colors.purple}
          />
        }
      >


        {/* Date Selector Row */}
        <View style={styles.dateSelectorRow}>
          <TouchableOpacity
            style={styles.datePickerBtn}
            activeOpacity={0.7}
            onPress={() => setShowFromPicker(true)}
          >
            <Icon name="calendar" size={16} color={theme.colors.linkPrimary} style={{ marginRight: 8 }} />
            <View>
              <Text style={styles.dateBtnLabel}>From Date</Text>
              <Text style={styles.dateBtnValue}>{fromDate}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.datePickerBtn}
            activeOpacity={0.7}
            onPress={() => setShowToPicker(true)}
          >
            <Icon name="calendar" size={16} color={theme.colors.linkPrimary} style={{ marginRight: 8 }} />
            <View>
              <Text style={styles.dateBtnLabel}>To Date</Text>
              <Text style={styles.dateBtnValue}>{toDate}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Expenses List */}
        <View style={styles.listContainer}>
          {expenses.map((record) => {
            const isApproved = record.status === 'Approved';
            const isRejected = record.status === 'Rejected';
            const badgeBg = isApproved
              ? theme.colors.successSubtle
              : isRejected
                ? theme.colors.dangerSubtle
                : theme.colors.pendingChipBg;
            const badgeText = isApproved
              ? theme.colors.successStrong
              : isRejected
                ? theme.colors.dangerStrong
                : theme.colors.pendingChipText;

            return (
              <TouchableOpacity
                key={record.id}
                style={styles.recordCard}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('ExpenseDetails', { record })}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.titleWrap}>
                    <Text style={styles.expenseTitle}>{record.title}</Text>
                    <Text style={styles.schoolText}>{record.school}</Text>
                  </View>

                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: badgeBg }
                  ]}>
                    <Text style={[
                      styles.statusBadgeText,
                      { color: badgeText }
                    ]}>
                      {record.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardBottom}>
                  <Text style={styles.amountText}>{record.amount}</Text>
                  <View style={styles.dateRow}>
                    {record.date ? <Text style={styles.dateText}>{record.date}</Text> : null}
                    <Icon name="chevron-right" size={16} color={theme.colors.textMuted} style={{ marginLeft: 6 }} />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          {expenses.length === 0 && (
            <View style={styles.emptyContainer}>
              <Icon name="check-circle" size={48} color={theme.colors.success} style={styles.emptyIcon} />
              <Text style={styles.emptyText}>No pending expense requests</Text>
            </View>
          )}
        </View>

      </ScrollView>

      <CalendarPickerModal
        visible={showFromPicker}
        onClose={() => setShowFromPicker(false)}
        selectedDate={fromDate}
        onSelectDate={(date) => setFromDate(date)}
        title="Select From Date"
      />

      <CalendarPickerModal
        visible={showToPicker}
        onClose={() => setShowToPicker(false)}
        selectedDate={toDate}
        onSelectDate={(date) => setToDate(date)}
        title="Select To Date"
      />

      <AddExpenseModel
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onSuccess={() => fetchExpenses(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  dateSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },
  datePickerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  dateBtnLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  dateBtnValue: {
    fontSize: 14,
    color: theme.colors.textHeading,
    fontWeight: '600',
    marginTop: 2,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroWrapper: {
    marginTop: 10,
  },
  listContainer: {
    gap: 12,
    paddingHorizontal: 16,
  },
  recordCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleWrap: {
    flex: 1,
    marginRight: 10,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textHeading,
    marginBottom: 4,
  },
  schoolText: {
    fontSize: 14,
    color: theme.colors.textBody,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.textHeading,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.backgroundLight,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.textMuted,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: theme.colors.backgroundLight,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.textHeading,
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubTitle: {
    fontSize: 14,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: theme.colors.purple,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    ...theme.shadow.card,
  },
  retryButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    width: '100%',
  },
  emptyIcon: {
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
});