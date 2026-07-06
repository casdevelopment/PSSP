import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';
import HeroCard from '../../components/HeroCard';
import { useAuthStore } from '../../store/AuthStore';
import { getEmployeeCurrentSalary, getEmployeeSalaryHistory } from '../../network/apis';

export default function MySalary() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const empId = useAuthStore((state) => state.empId);

  const [currentSalaryData, setCurrentSalaryData] = useState([]);
  const [monthlyRecords, setMonthlyRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const year = new Date().getFullYear();
      const currentRes = await getEmployeeCurrentSalary(empId);
      const historyRes = await getEmployeeSalaryHistory(empId, year);

      if (currentRes?.success) {
        setCurrentSalaryData(currentRes.data || []);
      }
      if (historyRes?.success && historyRes.data) {
        setMonthlyRecords(historyRes.data.monthlyRecords || []);
      }
    } catch (error) {
      console.error('Error fetching staff salary details:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [empId]);

  useEffect(() => {
    if (empId) {
      fetchData();
    }
  }, [empId, fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const basic = currentSalaryData?.find(item => item.name?.toLowerCase() === 'basic')?.netAmount || 0;
  const allowance = currentSalaryData?.find(item => item.name?.toLowerCase() === 'allowance')?.netAmount || 0;
  const deductions = currentSalaryData
    ?.filter(item => {
      const name = item.name?.toLowerCase();
      return name !== 'basic' && name !== 'allowance';
    })
    ?.reduce((sum, item) => sum + (item.netAmount || 0), 0) || 0;
  const total = currentSalaryData?.[0]?.totalSalary || (basic + allowance + deductions);

  // Latest month status
  const latestRecord = monthlyRecords[0];
  const latestMonth = latestRecord ? latestRecord.monthLabel : new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  const isPaid = latestRecord ? (latestRecord.salaryStatus?.toLowerCase() === 'acknowledged' || latestRecord.salaryStatus?.toLowerCase() === 'paid') : false;
  const formattedPaidOn = latestRecord && latestRecord.paidOn
    ? new Date(latestRecord.paidOn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.successStrong} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.backgroundLight} />

      {/* Current Month Hero Using Reusable HeroCard */}
      <View style={{ marginTop: 10 }}>
        <HeroCard
          colors={isPaid ? theme.gradients.green : theme.gradients.orange}
          topLabel="Current Month"
          title={`PKR ${total.toLocaleString()}`}
          subtitle={latestMonth}
          titleStyle={styles.heroAmount}
          rightElement={
            <View style={styles.checkCircle}>
              <Icon name={isPaid ? "check" : "clock"} size={20} color={theme.colors.white} />
            </View>
          }
        >
          {/* Injected custom bottom row */}
          <View style={styles.heroBottomRow}>
            <Icon name="calendar" size={14} color={theme.colors.white90} style={{ marginRight: 6 }} />
            <Text style={styles.heroDate}>
              {latestRecord?.salaryStatus?.toLowerCase() === 'acknowledged'
                ? `Acknowledged on ${formattedPaidOn || ''}`
                : latestRecord?.salaryStatus?.toLowerCase() === 'paid'
                  ? `Paid on ${formattedPaidOn || ''}`
                  : 'Pending payment'
              }
            </Text>
          </View>
        </HeroCard>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.successStrong]} />
        }
      >
        {/* Salary Breakdown */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Salary Breakdown</Text>

          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Base Salary</Text>
            <Text style={styles.breakdownValue}>PKR {basic.toLocaleString()}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Allowances</Text>
            <Text style={styles.breakdownValue}>PKR {allowance.toLocaleString()}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Deductions</Text>
            <Text style={[styles.breakdownValue, { color: theme.colors.danger }]}>
              {deductions < 0 ? `PKR - ${Math.abs(deductions).toLocaleString()}` : `PKR ${deductions.toLocaleString()}`}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>PKR {total.toLocaleString()}</Text>
          </View>
        </View>

        {/* Salary History Preview */}
        <View style={styles.historyHeader}>
          <Text style={styles.sectionTitle}>Salary History</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SalaryHistory')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionCard}>
          {monthlyRecords.length === 0 ? (
            <Text style={{ textAlign: 'center', color: theme.colors.textMuted, marginVertical: 10 }}>
              No salary history found.
            </Text>
          ) : (
            monthlyRecords.slice(0, 3).map((item, index) => {
              const recIsPaid = item.salaryStatus?.toLowerCase() === 'acknowledged' || item.salaryStatus?.toLowerCase() === 'paid';
              const recDateFormatted = item.paidOn
                ? new Date(item.paidOn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'Pending';

              return (
                <TouchableOpacity
                  key={item.registerMasterId || String(index)}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('SalaryDetail', {
                    registerMasterId: item.registerMasterId,
                    month: item.monthLabel,
                    amount: `PKR ${item.netSalary?.toLocaleString()}`,
                    salaryStatus: item.salaryStatus,
                    remarks: item.remarks
                  })}
                >
                  <View style={[styles.historyRow, index === Math.min(3, monthlyRecords.length) - 1 && { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 }]}>
                    <View>
                      <Text style={styles.historyMonth}>{item.monthLabel}</Text>
                      <Text style={styles.historyDate}>
                        {item.salaryStatus === 'Acknowledged'
                          ? `Acknowledged: ${recDateFormatted}`
                          : item.salaryStatus === 'Paid'
                            ? `Paid: ${recDateFormatted}`
                            : 'Pending'
                        }
                      </Text>
                    </View>
                    <View style={styles.historyRight}>
                      <Text style={styles.historyAmount}>PKR {item.netSalary?.toLocaleString()}</Text>
                      <View style={styles.statusRow}>
                        <Icon
                          name={recIsPaid ? "check" : "clock"}
                          size={14}
                          color={recIsPaid ? theme.colors.successStrong : theme.colors.warning}
                          style={{ marginRight: 4 }}
                        />
                        <Text style={[styles.statusText, { color: recIsPaid ? theme.colors.successStrong : theme.colors.warning }]}>
                          {item.salaryStatus || 'Pending'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>


        {/* Download Button */}
        {/* <TouchableOpacity style={styles.outlineBtn}>
          <Icon name="download" size={18} color={theme.colors.textHeading} style={{ marginRight: 8 }} />
          <Text style={styles.outlineBtnText}>Download Payslip</Text>
        </TouchableOpacity> */}

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
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  // Custom styles specifically for the Salary Hero
  heroAmount: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 2,
  },
  checkCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 16,
    marginTop: 8,
  },
  heroDate: {
    fontSize: 14,
    color: theme.colors.white90,
  },
  // Standard screen styles below
  sectionCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textHeading,
    marginBottom: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  breakdownLabel: {
    fontSize: 15,
    color: theme.colors.textBody,
  },
  breakdownValue: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textHeading,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.borderSubtle,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.textHeading,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.successStrong,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.linkPrimary,
    marginBottom: 16,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceSubtle,
    marginBottom: 4,
  },
  historyMonth: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textHeading,
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textHeading,
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.successStrong,
  },
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 20,
  },
  outlineBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textHeading,
  },
});