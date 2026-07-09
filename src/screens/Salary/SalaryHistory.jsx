import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';
import { useAuthStore } from '../../store/AuthStore';
import { getEmployeeSalaryHistory } from '../../network/apis';

export default function SalaryHistory() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const empId = useAuthStore((state) => state.empId);

    const currentYear = new Date().getFullYear();
    const years = [currentYear, currentYear - 1, currentYear - 2];

    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [historyData, setHistoryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchHistory = useCallback(async () => {
        try {
            const res = await getEmployeeSalaryHistory(empId, selectedYear);
            if (res?.success) {
                setHistoryData(res.data || null);
            }
        } catch (error) {
            console.error('Error fetching employee salary history:', error);
            setHistoryData([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [empId, selectedYear]);

    useFocusEffect(
        useCallback(() => {
            if (empId) {
                fetchHistory();
            }
        }, [empId, fetchHistory])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchHistory();
    };

    const yearlySummary = historyData?.yearlySummary || {
        totalYearlySalary: 0,
        averageMonthlySalary: 0,
        totalMonthsPaid: 0,
        totalYearlyBase: 0,
        totalYearlyAllowances: 0,
        totalYearlyDeductions: 0
    };

    const monthlyRecords = historyData?.monthlyRecords || [];
    const earningsBreakdown = historyData?.earningsBreakdown || {
        totalBaseSalary: 0,
        totalAllowances: 0,
        totalDeductions: 0,
        totalNetEarnings: 0
    };

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
                    <Text style={styles.pageTitle}>Salary History</Text>
                    <Text style={styles.pageSubtitle}>Complete payment records</Text>
                </View>
            </View>

            {/* Floating Stats */}
            <View style={[styles.statsContainer, theme.shadow.card]}>
                <View style={[styles.statBox, { backgroundColor: theme.colors.successSubtle }]}>
                    <View style={styles.statLabelRow}>
                        <Text style={[styles.statLabel, { color: theme.colors.successStrong }]}>Total ({selectedYear})</Text>
                    </View>
                    <Text style={[styles.statValue, { color: theme.colors.successStrong }]}>
                        PKR {yearlySummary.totalYearlySalary.toLocaleString()}
                    </Text>
                </View>

                <View style={[styles.statBox, { backgroundColor: theme.colors.blueSurface }]}>
                    <View style={styles.statLabelRow}>
                        {/* <Icon name="trending-up" size={14} color={theme.colors.linkPrimary} /> */}
                        <Text style={[styles.statLabel, { color: theme.colors.linkPrimary }]}>Average</Text>
                    </View>
                    <Text style={[styles.statValue, { color: theme.colors.linkPrimary }]}>
                        PKR {Math.round(yearlySummary.averageMonthlySalary).toLocaleString()}
                    </Text>
                </View>
            </View>

            {/* Year Tabs */}
            <View style={styles.tabsRow}>
                {years.map((y) => (
                    <TouchableOpacity
                        key={y}
                        style={selectedYear === y ? styles.activeTab : styles.inactiveTab}
                        onPress={() => {
                            setLoading(true);
                            setSelectedYear(y);
                        }}
                    >
                        <Text style={selectedYear === y ? styles.activeTabText : styles.inactiveTabText}>{y}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {loading && !refreshing ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={theme.colors.successStrong} />
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.successStrong]} />
                    }
                >
                    {/* Payment Records Header */}
                    <View style={styles.listHeaderRow}>
                        <Text style={styles.sectionTitle}>Payment Records</Text>
                        <Text style={styles.recordsCount}>{monthlyRecords.length} payments</Text>
                    </View>

                    {/* Cards */}
                    {monthlyRecords.length === 0 ? (
                        <View style={styles.recordCard}>
                            <Text style={{ textAlign: 'center', color: theme.colors.textMuted }}>
                                No records found for {selectedYear}
                            </Text>
                        </View>
                    ) : (
                        monthlyRecords.map((record, index) => {
                            const recIsPaid = record.salaryStatus?.toLowerCase() === 'acknowledged' || record.salaryStatus?.toLowerCase() === 'paid';
                            const formattedPaidDate = record.paidOn
                                ? new Date(record.paidOn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                : 'Pending';

                            return (
                                <TouchableOpacity
                                    key={record.registerMasterId || String(index)}
                                    style={styles.recordCard}
                                    activeOpacity={0.7}
                                    onPress={() => navigation.navigate('SalaryDetail', {
                                        registerMasterId: record.registerMasterId,
                                        month: record.monthLabel,
                                        amount: `PKR ${record.netSalary?.toLocaleString()}`,
                                        salaryStatus: record.salaryStatus,
                                        remarks: record.remarks
                                    })}
                                >
                                    <View style={styles.recordTop}>
                                        <View style={styles.monthRow}>
                                            <Icon name="calendar" size={16} color={theme.colors.successStrong} style={{ marginRight: 8 }} />
                                            <Text style={styles.recordMonth}>{record.monthLabel}</Text>
                                        </View>
                                        <View style={[styles.paidBadge, { backgroundColor: recIsPaid ? theme.colors.successSubtle : theme.colors.pendingChipBg }]}>
                                            <Text style={[styles.paidBadgeText, { color: recIsPaid ? theme.colors.successStrong : theme.colors.pendingChipText }]}>
                                                {record.salaryStatus || 'Pending'}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.amountRow}>
                                        <Text style={styles.recordAmount}>PKR {record.netSalary?.toLocaleString()}</Text>
                                    </View>

                                    <View style={styles.breakdownGrid}>
                                        <View style={styles.gridItem}>
                                            <Text style={styles.gridLabel}>Base</Text>
                                            <Text style={styles.gridValue}>PKR {record.baseSalary?.toLocaleString()}</Text>
                                        </View>
                                        <View style={styles.gridItem}>
                                            <Text style={styles.gridLabel}>Allowances</Text>
                                            <Text style={styles.gridValue}>PKR {record.totalAllowances?.toLocaleString()}</Text>
                                        </View>
                                        <View style={styles.gridItem}>
                                            <Text style={styles.gridLabel}>Deductions</Text>
                                            <Text style={[styles.gridValue, { color: theme.colors.danger }]}>
                                                PKR {record.totalDeductions?.toLocaleString()}
                                            </Text>
                                        </View>
                                    </View>

                                    <Text style={styles.paidDateText}>
                                        {record.salaryStatus === 'Acknowledged'
                                            ? `Acknowledged on ${formattedPaidDate}`
                                            : record.salaryStatus === 'Paid'
                                                ? `Paid on ${formattedPaidDate}`
                                                : 'Pending payment'
                                        }
                                    </Text>
                                </TouchableOpacity>
                            );
                        })
                    )}

                    {/* Earnings Breakdown Bottom */}
                    <View style={styles.breakdownCard}>
                        <Text style={styles.sectionTitle}>Earnings Breakdown ({selectedYear})</Text>

                        <View style={styles.breakdownRow}>
                            <Text style={styles.breakdownLabel}>Total Base Salary</Text>
                            <Text style={styles.breakdownValue}>PKR {earningsBreakdown.totalBaseSalary.toLocaleString()}</Text>
                        </View>
                        <View style={styles.breakdownRow}>
                            <Text style={styles.breakdownLabel}>Total Allowances</Text>
                            <Text style={styles.breakdownValue}>PKR {earningsBreakdown.totalAllowances.toLocaleString()}</Text>
                        </View>
                        <View style={styles.breakdownRow}>
                            <Text style={styles.breakdownLabel}>Total Deductions</Text>
                            <Text style={[styles.breakdownValue, { color: theme.colors.danger }]}>
                                PKR {earningsBreakdown.totalDeductions.toLocaleString()}
                            </Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Net Earnings</Text>
                            <Text style={styles.totalAmount}>PKR {earningsBreakdown.totalNetEarnings.toLocaleString()}</Text>
                        </View>
                    </View>

                </ScrollView>
            )}
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
        fontSize: 15,
        color: theme.colors.white80,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 40,
        marginTop: -5,
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        padding: 12,
        gap: 12,
        marginHorizontal: 16,
        marginBottom: 5,
        marginTop: -30,
    },
    statBox: {
        flex: 1,
        borderRadius: 12,
        padding: 16,
    },
    statLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    statLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '800',
    },
    tabsRow: {
        flexDirection: 'row',
        marginBottom: 20,
        marginHorizontal: 16,
        marginTop: 10,
        gap: 10,
    },
    activeTab: {
        backgroundColor: theme.colors.successStrong,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    activeTabText: {
        color: theme.colors.white,
        fontSize: 14,
        fontWeight: '600',
    },
    inactiveTab: {
        backgroundColor: theme.colors.white,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
    },
    inactiveTabText: {
        color: theme.colors.textBody,
        fontSize: 14,
        fontWeight: '500',
    },
    listHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.textHeading,
    },
    recordsCount: {
        fontSize: 14,
        color: theme.colors.textMuted,
    },
    recordCard: {
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
    },
    recordTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    monthRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    recordMonth: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.textHeading,
    },
    paidBadge: {
        backgroundColor: theme.colors.successSubtle,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    paidBadgeText: {
        color: theme.colors.successStrong,
        fontSize: 12,
        fontWeight: '600',
    },
    amountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    recordAmount: {
        fontSize: 28,
        fontWeight: '800',
        color: theme.colors.successStrong,
    },
    downloadRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    downloadText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.linkPrimary,
    },
    breakdownGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    gridItem: {
        flex: 1,
    },
    gridLabel: {
        fontSize: 13,
        color: theme.colors.textMuted,
        marginBottom: 4,
    },
    gridValue: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.textHeading,
    },
    paidDateText: {
        fontSize: 13,
        color: theme.colors.textMuted,
    },
    breakdownCard: {
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        padding: 20,
        marginTop: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
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
});