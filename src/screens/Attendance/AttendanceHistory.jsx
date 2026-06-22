import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';
import { useAuthStore } from '../../store/AuthStore';
import { getEmployeeAttendanceSummary, getEmployeesAttendanceLast7Days } from '../../network/apis';
import CalendarPickerModal from '../../components/CalendarPickerModal';

const StatChip = ({ value, label, type }) => {
    let textColor = theme.colors.black;
    let bgColor = theme.colors.white;

    if (type === 'present') {
        textColor = theme.colors.success;
        bgColor = theme.colors.successSubtle;
    } else if (type === 'absent') {
        textColor = theme.colors.danger;
        bgColor = theme.colors.dangerSubtle;
    } else if (type === 'late' || type === 'leave') {
        textColor = theme.colors.warning;
        bgColor = theme.colors.warningSubtle;
    } else if (type === 'total') {
        textColor = theme.colors.linkPrimary;
        bgColor = theme.colors.purpleSubtle;
    }

    return (
        <View style={[styles.statChip, { backgroundColor: bgColor }]}>
            <Text style={[styles.statValueCentered, { color: textColor }]}>{value}</Text>
            <Text style={[styles.statLabelCentered, { color: textColor }]}>{label}</Text>
        </View>
    );
};

export default function AttendanceHistory() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();
    const isFocused = useIsFocused();

    const role = useAuthStore((state) => state.userType);
    const empId = useAuthStore((state) => state.empId);
    const schoolId = useAuthStore((state) => state.schoolId);

    const type = route.params?.type || 'staff';
    const isStudent = type === 'student';

    const [fromDate, setFromDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        return d.toISOString().split('T')[0];
    });
    const [toDate, setToDate] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });
    const [activeDatePicker, setActiveDatePicker] = useState(null); // 'from' | 'to' | null
    const [isLoading, setIsLoading] = useState(false);
    const [summaryData, setSummaryData] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    
    useEffect(() => {
        if (isFocused) {
            loadHistory();
        }
    }, [isFocused, type, fromDate, toDate]);

    const loadHistory = async () => {
        setIsLoading(true);
        try {
            if (isStudent) {
                // For Staff viewing Student attendance
                const payload = {
                    employeeId: Number(empId) || 0,
                    schoolId: Number(schoolId) || 0,
                    fromDate: new Date(fromDate + 'T00:00:00').toISOString(),
                    toDate: new Date(toDate + 'T23:59:59').toISOString()
                };
                const res = await getEmployeeAttendanceSummary(payload);
                if (res && res.success && res.data) {
                    const { summary, attendList } = res.data;
                    
                    const formattedData = (attendList || []).map((item, index) => {
                        const dateObj = new Date(item.attendanceDate);
                        const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                        
                        return {
                            id: `${item.attendanceDate}-${item.classId}-${item.sectionId}-${index}`,
                            date: dateStr,
                            present: item.totalPresent || 0,
                            absent: item.totalAbsent || 0,
                            leave: item.totalLeave || 0,
                            percent: item.dailyAttendancePct || 0,
                            subtitle: `${item.gradeName} - ${item.className} (${item.sectionName})`
                        };
                    });
                    
                    setSummaryData({
                        overallAttendancePct: summary?.overallAttendancePct || 0,
                        totalClasses: summary?.totalClasses || 0,
                        overallPresent: summary?.overallPresent || 0,
                        overallAbsent: summary?.overallAbsent || 0,
                    });
                    setHistoryData(formattedData);
                } else {
                    setSummaryData(null);
                    setHistoryData([]);
                }
            } else {
                // For Principal viewing Staff attendance
                const res = await getEmployeesAttendanceLast7Days(schoolId);
                if (res && res.success && res.data) {
                    const dataList = res.data || [];
                    
                    const formattedData = dataList.map((item, index) => {
                        const dateObj = new Date(item.attendanceDate);
                        const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                        
                        return {
                            id: `${item.attendanceDate}-${index}`,
                            date: dateStr,
                            present: item.presentCount || 0,
                            absent: item.absentCount || 0,
                            total: item.totalEmployees || 0,
                            percent: item.dailyPercentage || 0,
                            subtitle: `Total Staff: ${item.totalEmployees}`
                        };
                    });

                    const firstRecord = dataList[0];
                    setSummaryData({
                        overallAttendancePct: firstRecord?.weeklyAvgPercentage || 0,
                        totalPresent: firstRecord?.overAllLast7DaysPresentSum || 0,
                        totalAbsent: firstRecord?.overAllLast7DaysAbsentSum || 0,
                        totalEmployees: firstRecord?.totalEmployees || 0
                    });
                    setHistoryData(formattedData);
                } else {
                    setSummaryData(null);
                    setHistoryData([]);
                }
            }
        } catch (error) {
            console.error('Failed to load attendance history:', error);
            Alert.alert('Error', 'Failed to load attendance history.');
            setSummaryData(null);
            setHistoryData([]);
        } finally {
            setIsLoading(false);
        }
    };

    const weeklyAverage = summaryData?.overallAttendancePct || 0;

    const topStats = isStudent
        ? [
            { value: (summaryData?.totalClasses || 0).toString(), label: 'Classes', color: theme.colors.linkPrimary },
            { value: (summaryData?.overallPresent || 0).toString(), label: 'Present', color: theme.colors.success },
            { value: (summaryData?.overallAbsent || 0).toString(), label: 'Absent', color: theme.colors.danger }
        ]
        : [
            { value: (summaryData?.totalPresent || 0).toString(), label: 'Present', color: theme.colors.success },
            { value: (summaryData?.totalAbsent || 0).toString(), label: 'Absent', color: theme.colors.danger },
            { value: (summaryData?.totalEmployees || 0).toString(), label: 'Total Staff', color: theme.colors.linkPrimary }
        ];

    const getPercentStyle = (percent) => {
        if (percent >= 95) {
            return { bg: theme.colors.successSubtle, text: theme.colors.success };
        }
        return { bg: theme.colors.warningSubtle, text: theme.colors.warning };
    };

    const formatDateForDisplay = (dateStr) => {
        if (!dateStr) return '';
        const dateObj = new Date(dateStr);
        return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.purple} />

            {/* Background Header */}
            <View style={[styles.headerBg, { paddingTop: insets.top }]}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="chevron-left" size={24} color={theme.colors.white} />
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.headerTitle}>Attendance History</Text>
                {isStudent ? (
                    <View style={styles.datePickerRow}>
                        <TouchableOpacity 
                            style={styles.dateInput} 
                            onPress={() => setActiveDatePicker('from')}
                        >
                            <Icon name="calendar" size={16} color={theme.colors.white80} />
                            <Text style={styles.dateInputText}>{formatDateForDisplay(fromDate)}</Text>
                        </TouchableOpacity>
                        <Text style={styles.dateRangeSeparator}>to</Text>
                        <TouchableOpacity 
                            style={styles.dateInput} 
                            onPress={() => setActiveDatePicker('to')}
                        >
                            <Icon name="calendar" size={16} color={theme.colors.white80} />
                            <Text style={styles.dateInputText}>{formatDateForDisplay(toDate)}</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <Text style={styles.headerSubtitle}>Last 7 days</Text>
                )}
            </View>

            {/* Summary Card */}
            <View style={[styles.summaryCard, theme.shadow.card]}>
                <View style={styles.summaryTop}>
                    <View style={styles.averageIconCircle}>
                        <Icon name="trending-up" size={24} color={theme.colors.purple} />
                    </View>
                    <View style={styles.averageInfo}>
                        <Text style={styles.averageLabel}>Weekly Average</Text>
                        <Text style={styles.averageValue}>{weeklyAverage}%</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.summaryStatsRow}>
                    {topStats.map((stat, index) => (
                        <View key={index} style={styles.summaryStatItem}>
                            <Text style={[styles.summaryStatValue, { color: stat.color }]}>{stat.value}</Text>
                            <Text style={styles.summaryStatLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <ScrollView
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
                showsVerticalScrollIndicator={false}
            >
                {isLoading ? (
                    <View style={styles.centered}>
                        <ActivityIndicator size="large" color={theme.colors.purple} />
                        <Text style={styles.loadingText}>Fetching attendance history...</Text>
                    </View>
                ) : historyData.length === 0 ? (
                    <View style={styles.centered}>
                        <Icon name="calendar" size={48} color={theme.colors.textMuted} style={styles.emptyIcon} />
                        <Text style={styles.emptyText}>No attendance records found</Text>
                        <Text style={styles.emptySubtitle}>Try adjusting your date range filter</Text>
                    </View>
                ) : (
                    <View style={styles.listContainer}>
                        {historyData.map((item) => {
                            const percentStyle = getPercentStyle(item.percent);
                            return (
                                <View key={item.id} style={styles.historyCard}>
                                    <View style={styles.historyCardTop}>
                                        <View style={styles.dateContainer}>
                                            <Icon name="calendar" size={18} color={theme.colors.linkPrimary} />
                                            <View style={styles.dateTextContainer}>
                                                <Text style={styles.dateText}>{item.date}</Text>
                                                {item.subtitle && <Text style={styles.dateSubtitle}>{item.subtitle}</Text>}
                                            </View>
                                        </View>
                                        <View style={[styles.percentBadge, { backgroundColor: percentStyle.bg }]}>
                                            <Text style={[styles.percentText, { color: percentStyle.text }]}>
                                                {item.percent}%
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.historyChipsRow}>
                                        <StatChip value={item.present} label="Present" type="present" />
                                        <StatChip value={item.absent} label="Absent" type="absent" />
                                        {isStudent ? (
                                            <StatChip value={item.leave} label="Leave" type="leave" />
                                        ) : (
                                            <StatChip value={item.total} label="Total" type="total" />
                                        )}
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                )}
            </ScrollView>

            {/* Calendar Pickers */}
            <CalendarPickerModal
                visible={activeDatePicker === 'from'}
                onClose={() => setActiveDatePicker(null)}
                selectedDate={fromDate}
                onSelectDate={(date) => {
                    if (date > toDate) {
                        Alert.alert('Invalid Date', 'From date cannot be after to date.');
                        return;
                    }
                    setFromDate(date);
                }}
                title="Select From Date"
            />
            <CalendarPickerModal
                visible={activeDatePicker === 'to'}
                onClose={() => setActiveDatePicker(null)}
                selectedDate={toDate}
                onSelectDate={(date) => {
                    if (date < fromDate) {
                        Alert.alert('Invalid Date', 'To date cannot be before from date.');
                        return;
                    }
                    setToDate(date);
                }}
                title="Select To Date"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.appBackground,
    },
    headerBg: {
        backgroundColor: theme.colors.purple,
        paddingHorizontal: 20,
        paddingBottom: 70,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: -8,
    },
    backText: {
        color: theme.colors.white,
        fontSize: 16,
        fontWeight: '500',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: theme.colors.white,
        marginBottom: 4,
        marginTop: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: theme.colors.white80,
    },
    scrollContent: {
        paddingTop: 10,
    },
    summaryCard: {
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        marginHorizontal: 16,
        marginTop: -40,
        padding: 20,
        marginBottom: 10,
    },
    summaryTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    averageIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.purpleSubtle,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    averageInfo: {
        flex: 1,
    },
    averageLabel: {
        fontSize: 14,
        color: theme.colors.textMuted,
        marginBottom: 2,
    },
    averageValue: {
        fontSize: 32,
        fontWeight: '800',
        color: theme.colors.textHeading,
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.borderSubtle,
        marginBottom: 20,
    },
    summaryStatsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    summaryStatItem: {
        alignItems: 'center',
    },
    summaryStatValue: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
    },
    summaryStatLabel: {
        fontSize: 14,
        color: theme.colors.textMuted,
    },
    listContainer: {
        paddingHorizontal: 16,
    },
    historyCard: {
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
    },
    historyCardTop: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    dateTextContainer: {
        marginLeft: 10,
    },
    dateText: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.textHeading,
        marginTop: -2,
    },
    dateSubtitle: {
        fontSize: 14,
        color: theme.colors.textMuted,
        marginTop: 2,
    },
    percentBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    percentText: {
        fontSize: 14,
        fontWeight: '600',
    },
    historyChipsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    statChip: {
        flex: 1,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    statValueCentered: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 2,
    },
    statLabelCentered: {
        fontSize: 12,
        fontWeight: '500',
    },
    datePickerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        gap: 8,
    },
    dateInput: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        gap: 8,
    },
    dateInputText: {
        color: theme.colors.white,
        fontSize: 14,
        fontWeight: '500',
    },
    dateRangeSeparator: {
        color: theme.colors.white80,
        fontSize: 14,
        fontWeight: '500',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 15,
        color: theme.colors.textMuted,
        fontWeight: '500',
    },
    emptyIcon: {
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.textHeading,
        marginBottom: 4,
    },
    emptySubtitle: {
        fontSize: 14,
        color: theme.colors.textMuted,
        textAlign: 'center',
    },
});