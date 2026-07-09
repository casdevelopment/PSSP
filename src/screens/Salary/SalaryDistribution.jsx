import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';
import HeroCard from '../../components/HeroCard';
import { useAuthStore } from '../../store/AuthStore';
import SearchFilter from '../../components/SearchFilter';
import {
  getEmployeeSalaryStatusBySchool,
  getEmployeeSchoolDashboardDetails,
  principalSalaryAcknowledgement
} from '../../network/apis';
const formatEstablishmentDate = (dateStr) => {
  if (!dateStr || dateStr.startsWith('1900-01-01')) {
    return 'N/A';
  }
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return 'N/A';
  }
};

const formatSalaryDate = (dateStr) => {
  if (!dateStr || dateStr.startsWith('1900-01-01')) {
    return 'N/A';
  }
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', { month: 'long' });
  } catch {
    return 'N/A';
  }
};

export default function SalaryDistribution() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const role = useAuthStore((state) => state.userType); // 'coordinator', 'principal'
  const empId = useAuthStore((state) => state.empId);
  const schoolId = useAuthStore((state) => state.schoolId);
  const userId = useAuthStore((state) => state.userId);

  const [activeTab, setActiveTab] = useState('Current Month');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [payingId, setPayingId] = useState(null); // tracking paying state for individual items
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(async () => {
    try {
      if (role === 'coordinator') {
        const res = await getEmployeeSchoolDashboardDetails(empId);
        if (res?.success) {
          setData(res.data || []);
        } else if (res?.code === 404) {
          setData([]);
        }
      } else {
        // Principal
        const res = await getEmployeeSalaryStatusBySchool(schoolId);
        if (res?.success) {
          setData(res.data || []);
        } else if (res?.code === 404) {
          setData([]);
        }
      }
    } catch (error) {
      console.error('Error fetching salary distribution data:', error);
      setData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [role, empId, schoolId]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handlePayNow = async (item) => {
    if (payingId) return;
    setPayingId(item.empid);
    try {
      const payload = {
        empId: item.empid,
        registerId: item.registerId,
        userId: userId
      };
      const res = await principalSalaryAcknowledgement(payload);
      if (res?.success) {
        Alert.alert('Success', `Salary of ${item.name} paid successfully.`);
        // Refresh local data state
        setData(prevData => prevData.map(d => {
          if (d.empid === item.empid && d.registerId === item.registerId) {
            return { ...d, salaryStatus: 'Paid' };
          }
          return d;
        }));
      } else {
        Alert.alert('Error', res?.message || 'Failed to pay salary.');
      }
    } catch (error) {
      console.error('Error acknowledging salary payment:', error);
      Alert.alert('Error', 'An error occurred while paying salary.');
    } finally {
      setPayingId(null);
    }
  };

  // Calculations for Hero Card
  let totalAmount = 0;
  let subtitleText = '';

  if (role === 'coordinator') {
    totalAmount = data.reduce((sum, item) => sum + (item.totalSchoolSalary || 0), 0);
    subtitleText = `${data.length} assigned schools`;
  } else {
    // Principal
    totalAmount = data.reduce((sum, item) => sum + (item.netSalary || 0), 0);
    subtitleText = `${data.length} staff members`;
  }

  // Filter data based on selected tab
  let filteredData = [...data];
  if (activeTab === 'History') {
    if (role === 'coordinator') {
      filteredData = [...data]; // School summaries are constant
    } else {
      // Principal shows paid/acknowledged staff records in history tab
      filteredData = data.filter(d => d.salaryStatus?.toLowerCase() === 'paid' || d.salaryStatus?.toLowerCase() === 'acknowledge');
    }
  }

  // Apply search query filter
  if (searchQuery) {
    filteredData = filteredData.filter((item) => {
      if (role === 'coordinator') {
        return item.schoolName?.toLowerCase().includes(searchQuery.toLowerCase());
      } else {
        return item.name?.toLowerCase().includes(searchQuery.toLowerCase());
      }
    });
  }

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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.successStrong]} />
        }
      >

        {/* Total Distribution Hero */}
        <View style={styles.heroWrapper}>
          <HeroCard
            topLabel={role === 'coordinator' ? "Total Schools Salaries" : "Total Staff Salaries"}
            title={`PKR ${totalAmount.toLocaleString()}`}
            subtitle={subtitleText}
            colors={theme.gradients.green}
          />
        </View>

        {/* Search Bar */}
        <SearchFilter
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={role === 'coordinator' ? "Search school..." : "Search staff..."}
        />

        {/* Tabs */}
        {/* <View style={styles.tabsRow}>
          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'Current Month' ? styles.tabActive : styles.tabInactive]}
            onPress={() => setActiveTab('Current Month')}
          >
            <Text style={[styles.tabText, activeTab === 'Current Month' ? styles.tabTextActive : styles.tabTextInactive]}>
              Current Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'History' ? styles.tabActive : styles.tabInactive]}
            onPress={() => setActiveTab('History')}
          >
            <Text style={[styles.tabText, activeTab === 'History' ? styles.tabTextActive : styles.tabTextInactive]}>
              History
            </Text>
          </TouchableOpacity>
        </View> */}

        {/* Staff / School List */}
        <View style={styles.listContainer}>
          {filteredData.length === 0 ? (
            <View style={styles.recordCard}>
              <Text style={{ textAlign: 'center', color: theme.colors.textMuted }}>
                {searchQuery ? 'No matching records found.' : 'No records found.'}
              </Text>
            </View>
          ) : (
            filteredData.map((item, idx) => {
              if (role === 'coordinator') {
                const formattedEstablishment = formatEstablishmentDate(item.dateOfEstablishment);

                return (
                  <TouchableOpacity
                    key={item.schoolIdFk || String(idx)}
                    style={styles.recordCard}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('StaffSalaryDetails', {
                      record: {
                        name: item.principalName || 'No Principal Assigned',
                        principalId: item.principalId,
                        schoolName: item.schoolName,
                        schoolId: item.schoolIdFk,
                        amount: `PKR ${item.totalSchoolSalary.toLocaleString()}`,
                        status: 'Paid',
                        isCoordinatorView: true,
                        schoolEmployees: item.schoolEmployees,
                        totalSchoolSalary: item.totalSchoolSalary
                      }
                    })}
                  >
                    <View style={styles.cardHeader}>
                      <View style={{ flex: 1, paddingRight: 8 }}>
                        <Text style={styles.staffName}>{item.schoolName}</Text>
                        <Text style={styles.staffSubject}>Principal: {item.principalName || 'Not Assigned'}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: theme.colors.blueSurface }]}>
                        <Text style={[styles.statusBadgeText, { color: theme.colors.linkPrimary }]}>
                          Active
                        </Text>
                      </View>
                    </View>

                    <View style={styles.cardBottom}>
                      <View>
                        <Text style={styles.amountText}>PKR {item.totalSchoolSalary.toLocaleString()}</Text>
                        <View style={styles.dateRow}>
                          <Icon name="calendar" size={13} color={theme.colors.textMuted} style={{ marginRight: 6 }} />
                          <Text style={styles.dateText}>Est: {formattedEstablishment}</Text>
                        </View>
                      </View>

                      <View style={styles.paidCircle}>
                        <Icon name="chevron-right" size={16} color={theme.colors.linkPrimary} />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              } else {
                // Principal View (Staff Salaries)
                const isPaid = item.salaryStatus?.toLowerCase() === 'paid' || item.salaryStatus?.toLowerCase() === 'acknowledge';
                const formattedPaymentDate = formatSalaryDate(item.salaryStatusChangeDate);

                return (
                  <TouchableOpacity
                    key={item.empid || String(idx)}
                    style={styles.recordCard}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('StaffSalaryDetails', {
                      record: {
                        empid: item.empid,
                        name: item.name,
                        subject: 'Staff Member',
                        amount: `PKR ${item.netSalary?.toLocaleString()}`,
                        date: item.salaryStatusChangeDate,
                        status: item.salaryStatus,
                        registerId: item.registerId,
                        remarks: item.remarks,
                        isCoordinatorView: false
                      }
                    })}
                  >
                    <View style={styles.cardHeader}>
                      <View>
                        <Text style={styles.staffName}>{item.name}</Text>
                        <Text style={styles.staffSubject}>Staff Member</Text>
                      </View>
                      <View style={[
                        styles.statusBadge,
                        {
                          backgroundColor: isPaid
                            ? theme.colors.successSubtle
                            : item.salaryStatus?.toLowerCase() === 'not paid'
                              ? theme.colors.dangerSubtle
                              : theme.colors.pendingChipBg
                        }
                      ]}>
                        <Text style={[
                          styles.statusBadgeText,
                          {
                            color: isPaid
                              ? theme.colors.successStrong
                              : item.salaryStatus?.toLowerCase() === 'not paid'
                                ? theme.colors.dangerStrong
                                : theme.colors.pendingChipText
                          }
                        ]}>
                          {item.salaryStatus || 'Pending'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.cardBottom}>
                      <View>
                        <Text style={styles.amountText}>PKR {item.netSalary?.toLocaleString()}</Text>
                        <View style={styles.dateRow}>
                          <Icon name="calendar" size={13} color={theme.colors.textMuted} style={{ marginRight: 6 }} />
                          <Text style={styles.dateText}>
                            {isPaid ? `Paid: ${formattedPaymentDate}` : `Due Date: ${formattedPaymentDate}`}
                          </Text>
                        </View>
                      </View>

                      {isPaid ? (
                        <View style={styles.paidCircle}>
                          <Icon name="check" size={16} color={theme.colors.successStrong} />
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={styles.payNowBtn}
                          onPress={() => handlePayNow(item)}
                          disabled={payingId !== null}
                        >
                          {payingId === item.empid ? (
                            <ActivityIndicator size="small" color={theme.colors.white} />
                          ) : (
                            <Text style={styles.payNowBtnText}>Pay Now</Text>
                          )}
                        </TouchableOpacity>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }
            })
          )}
        </View>

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
    paddingBottom: 100,
  },
  heroWrapper: {
    marginTop: 10,
  },
  tabsRow: {
    flexDirection: 'row',
    marginBottom: 20,
    marginHorizontal: 16,
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: theme.colors.linkPrimary,
  },
  tabInactive: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
  },
  tabTextActive: {
    color: theme.colors.white,
  },
  tabTextInactive: {
    color: theme.colors.textBody,
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
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceSubtle,
    paddingBottom: 16,
  },
  staffName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textHeading,
    marginBottom: 4,
  },
  staffSubject: {
    fontSize: 14,
    color: theme.colors.textBody,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
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
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.textHeading,
    marginBottom: 6,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  paidCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.successSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payNowBtn: {
    backgroundColor: theme.colors.successStrong,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payNowBtnText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});