import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';
import HeroCard from '../../components/HeroCard';
import { useAuthStore } from '../../store/AuthStore';
import { getEmployeeSalaryDetails, getEmployeeCurrentSalary, principalSalaryAcknowledgement } from '../../network/apis';

export default function StaffSalaryDetails() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const userId = useAuthStore((state) => state.userId);

  const routeRecord = route.params?.record;
  const record = useMemo(() => routeRecord || {
    name: 'Staff Member',
    subject: 'Staff Member',
    amount: 'PKR 0',
    date: '',
    status: 'Pending',
    isCoordinatorView: false
  }, [routeRecord]);

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState([]); // for Principal view (detailed lines)
  const [currentSalaryData, setCurrentSalaryData] = useState([]); // for Coordinator view (principal current summary)
  const [salaryStatus, setSalaryStatus] = useState(record.status || 'Pending');
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    setSalaryStatus(record.status || 'Pending');
  }, [record.status]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (record.isCoordinatorView) {
          if (record.principalId) {
            const res = await getEmployeeCurrentSalary(record.principalId);
            if (res?.success) {
              setCurrentSalaryData(res.data || []);
            }
          }
        } else {
          if (record.registerId) {
            const res = await getEmployeeSalaryDetails(record.empid, record.registerId);
            if (res?.success) {
              setDetails(res.data || []);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching details in StaffSalaryDetails:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [record]);

  const handlePaySalary = async () => {
    if (paying) return;
    setPaying(true);
    try {
      const payload = {
        empId: record.empid,
        registerId: record.registerId,
        userId: userId
      };
      const res = await principalSalaryAcknowledgement(payload);
      if (res?.success) {
        Alert.alert('Success', `Salary of ${record.name} paid successfully.`);
        setSalaryStatus('Paid');
      } else {
        Alert.alert('Error', res?.message || 'Failed to pay salary.');
      }
    } catch (error) {
      console.error('Error acknowledging salary payment:', error);
      Alert.alert('Error', 'An error occurred while paying salary.');
    } finally {
      setPaying(false);
    }
  };

  const isPaid = salaryStatus?.toLowerCase() === 'paid' || salaryStatus?.toLowerCase() === 'acknowledge';

  // Dynamic values depending on Coordinator vs Principal
  let displayAmount = record.amount;
  let formattedDate = record.date
    ? new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'N/A';

  // For Coordinator: Principal breakdown
  const basic = currentSalaryData?.find(item => item.name?.toLowerCase() === 'basic')?.netAmount || 0;
  const allowance = currentSalaryData?.find(item => item.name?.toLowerCase() === 'allowance')?.netAmount || 0;
  const deductions = currentSalaryData
    ?.filter(item => {
      const name = item.name?.toLowerCase();
      return name !== 'basic' && name !== 'allowance';
    })
    ?.reduce((sum, item) => sum + (item.netAmount || 0), 0) || 0;
  const total = currentSalaryData?.[0]?.totalSalary || (basic + allowance + deductions);

  if (record.isCoordinatorView) {
    displayAmount = `PKR ${total.toLocaleString()}`;
  } else {
    const netSalaryComponent = details.find(item => item.componentName === 'TOTAL NET SALARY');
    if (netSalaryComponent) {
      displayAmount = `PKR ${netSalaryComponent.amount?.toLocaleString()}`;
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.successStrong} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.successStrong} />

      {/* Green Header Block */}
      <View style={[styles.headerBg, { paddingTop: insets.top }]}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="chevron-left" size={24} color={theme.colors.white} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerTitles}>
          <Text style={styles.pageTitle}>Salary Details</Text>
          <Text style={styles.pageSubtitle}>{record.isCoordinatorView ? record.schoolName : record.name}</Text>
        </View>
      </View>

      {/* Total Amount Card (Floating) Replaced with HeroCard */}
      <View style={{ marginTop: -30 }}>
        <HeroCard
          colors={[theme.colors.white, theme.colors.white]}
          topLabel={<Text style={{ color: theme.colors.textMuted }}>Total Amount</Text>}
          title={displayAmount}
          titleStyle={{ fontSize: 32, fontWeight: '800', color: theme.colors.textHeading }}
          rightElement={
            isPaid ? (
              <View
                style={[
                  styles.statusIconCircle,
                  { backgroundColor: theme.colors.successSubtle }
                ]}
              >
                <Icon
                  name="check"
                  size={24}
                  color={theme.colors.successStrong}
                />
              </View>
            ) : null
          }
        >
          {/* Bottom section updated to use dark text and subtle borders for the white background */}
          <View style={[styles.amountBottom, { borderTopColor: theme.colors.surfaceSubtle }]}>
            <Icon name="calendar" size={14} color={theme.colors.textMuted} style={{ marginRight: 8 }} />
            <Text style={[styles.dateText, { color: theme.colors.textBody }]}>
              Date: {formattedDate}
            </Text>
          </View>
        </HeroCard>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Coordinator Specific: Additional Information Card */}
        {record.isCoordinatorView && (
          <View style={styles.additionalCard}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            <View style={styles.additionalRow}>
              <View style={styles.additionalBlockLeft}>
                <Text style={styles.additionalLabel}>Total Staff</Text>
                <Text style={styles.additionalValueBlue}>{record.schoolEmployees || 0}</Text>
              </View>
              <View style={styles.additionalBlockRight}>
                <Text style={styles.additionalLabel}>Staff Salaries</Text>
                <Text style={styles.additionalValueGreen}>
                  PKR {(record.totalSchoolSalary || 0).toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Staff / Principal Information */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>{record.isCoordinatorView ? 'Principal Information' : 'Staff Information'}</Text>

          <View style={styles.infoRow}>
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.blueSurface }]}>
              <Icon name="user" size={18} color={theme.colors.linkPrimary} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{record.name}</Text>
            </View>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.purpleSurface }]}>
              <Icon name="tag" size={18} color={theme.colors.accentPurple} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Role</Text>
              <Text style={styles.infoValue}>{record.isCoordinatorView ? 'Principal' : 'Staff Member'}</Text>
            </View>
          </View>
        </View>

        {/* Remarks Card for Not Paid status */}
        {record.status?.toLowerCase() === 'not paid' && record.remarks && (
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Remarks</Text>
            <Text style={{ fontSize: 15, color: theme.colors.danger || '#DC2626', lineHeight: 22 }}>
              {record.remarks}
            </Text>
          </View>
        )}

        {/* Salary Breakdown */}
        <Text style={styles.sectionTitle}>Salary Breakdown</Text>
        <View style={styles.breakdownCard}>
          {record.isCoordinatorView ? (
            // Coordinator view renders mapped Principal current summary
            <>
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
            </>
          ) : (
            // Principal view renders dynamic breakdown lines from getEmployeeSalaryDetails
            details.filter(item => item.componentName !== 'TOTAL NET SALARY').map((item, idx) => (
              <View key={idx} style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>{item.componentName}</Text>
                <Text style={[
                  styles.breakdownValue,
                  item.amount < 0 && { color: theme.colors.danger }
                ]}>
                  {item.amount < 0
                    ? `PKR - ${Math.abs(item.amount).toLocaleString()}`
                    : `PKR ${item.amount.toLocaleString()}`
                  }
                </Text>
              </View>
            ))
          )}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Net Salary</Text>
            <Text style={styles.totalAmount}>{displayAmount}</Text>
          </View>
        </View>

        {/* Action Button: Principals can pay if status is Pending */}
        {!record.isCoordinatorView && (
          isPaid ? (
            <View style={[styles.primaryBtn, { backgroundColor: theme.colors.successSubtle }]}>
              <Icon name="check" size={18} color={theme.colors.successStrong} style={{ marginRight: 6 }} />
              <Text style={[styles.primaryBtnText, { color: theme.colors.successStrong }]}>Paid</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.primaryBtn}
              activeOpacity={0.8}
              onPress={handlePaySalary}
              disabled={paying}
            >
              {paying ? (
                <ActivityIndicator color={theme.colors.white} />
              ) : (
                <>
                  <Text style={styles.primaryBtnText}>Pay Salary Now</Text>
                </>
              )}
            </TouchableOpacity>
          )
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  headerBg: {
    backgroundColor: theme.colors.successStrong,
    paddingBottom: 60,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
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
  headerTitles: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.white,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 16,
    color: theme.colors.white90,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  amountBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceSubtle,
    paddingTop: 16,
  },
  statusIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  dateText: {
    fontSize: 14,
    color: theme.colors.textBody,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textHeading,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  additionalCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  additionalRow: {
    flexDirection: 'row',
    gap: 12,
  },
  additionalBlockLeft: {
    flex: 1,
    backgroundColor: theme.colors.blueSurface,
    borderRadius: 12,
    padding: 16,
  },
  additionalBlockRight: {
    flex: 1,
    backgroundColor: theme.colors.greenSurface,
    borderRadius: 12,
    padding: 16,
  },
  additionalLabel: {
    fontSize: 14,
    color: theme.colors.textBody,
    marginBottom: 8,
  },
  additionalValueBlue: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.linkPrimary,
  },
  additionalValueGreen: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.successStrong,
  },
  infoCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceSubtle,
  },
  infoLabel: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textHeading,
  },
  breakdownCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
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
  primaryBtn: {
    flexDirection: 'row',
    backgroundColor: theme.colors.successStrong,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  primaryBtnText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  outlineBtn: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  outlineBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textHeading,
  },
});