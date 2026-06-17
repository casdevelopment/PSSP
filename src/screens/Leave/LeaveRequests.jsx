import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    StatusBar,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';
import LeaveRequestCard from '../../components/LeaveRequestCard';
import { useAuthStore } from '../../store/AuthStore';
import { getEmpLeaveBalanceList, getEmpAllLeaveListHistory } from '../../network/apis';

// Adjust the import path based on where you saved your HeroCard component
import HeroCard from '../../components/HeroCard';

export const LEAVE_REQUESTS = [];

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

const ProgressBar = ({ label, used, total, color }) => {
    const percentage = total > 0 ? (used / total) * 100 : 0;

    return (
        <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>{label}</Text>
                <Text style={styles.progressValue}>
                    {used}/{total} used
                </Text>
            </View>
            <View style={styles.progressTrack}>
                <View
                    style={[
                        styles.progressFill,
                        { width: `${percentage}%`, backgroundColor: color },
                    ]}
                />
            </View>
        </View>
    );
};

export default function LeaveRequests() {
    const navigation = useNavigation();
    const empId = useAuthStore((state) => state.empId);
    const role = useAuthStore((state) => state.userType);

    // Helper boolean to keep conditional rendering clean
    const isManager = role === 'principal' || role === 'coordinator';

    const [leaveBalances, setLeaveBalances] = useState([]);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const fetchLeaveData = useCallback(async (showLoader = true) => {
        if (!empId) return;
        try {
            if (showLoader) setIsLoading(true);
            setError(null);

            const [balanceRes, historyRes] = await Promise.all([
                getEmpLeaveBalanceList(empId).catch(err => {
                    console.error('Error fetching balances:', err);
                    return null;
                }),
                getEmpAllLeaveListHistory(empId).catch(err => {
                    console.error('Error fetching history:', err);
                    return null;
                })
            ]);

            if (balanceRes && balanceRes.success) {
                setLeaveBalances(balanceRes.data || []);
            }

            if (historyRes && historyRes.success) {
                const mapped = (historyRes.data || []).map(item => {
                    const status = item.approved === true ? 'Approved' : item.approved === false ? 'Rejected' : 'Pending';
                    const statusTone = item.approved === true ? 'approved' : item.approved === false ? 'rejected' : 'pending';
                    const days = item.days || 1;
                    const durationStr = `${days} day${days > 1 ? 's' : ''}`;

                    const fromDateFormatted = formatDate(item.fromDate);
                    const toDateFormatted = formatDate(item.toDate);
                    const periodStr = fromDateFormatted === toDateFormatted ? fromDateFormatted : `${fromDateFormatted} - ${toDateFormatted}`;

                    return {
                        id: String(item.id),
                        type: item.entityLeaveType || 'Leave',
                        status: status,
                        statusTone: statusTone,
                        appliedDate: formatDate(item.fromDate), // Fallback
                        duration: durationStr,
                        period: periodStr,
                        days: days,
                        dateRange: periodStr,
                        reason: item.reason || 'No reason provided',
                        leaveType: item.entityLeaveType || 'Leave',
                        appliedOn: formatDate(item.fromDate),
                        entityLeaveTypeId: item.entityLeaveTypeId,
                    };
                });
                setLeaveRequests(mapped);
            }

            if ((!balanceRes || !balanceRes.success) && (!historyRes || !historyRes.success)) {
                setError('Failed to load leave data');
            }
        } catch (err) {
            console.error('Error fetching leave data:', err);
            setError(err.message || 'An error occurred while fetching leave data');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [empId]);

    useEffect(() => {
        if (role === 'staff' && empId) {
            fetchLeaveData(true);
        }
    }, [fetchLeaveData, role, empId]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchLeaveData(false);
    };

    // Calculate total balance for staff
    const totalBalance = leaveBalances.reduce((sum, item) => sum + (item.balance || 0), 0);

    // Dynamic colors for leave progress bars
    const progressColors = [
        theme.colors.linkPrimary,
        theme.colors.success,
        theme.colors.accentPurple,
        theme.colors.warning,
        theme.colors.danger,
        theme.colors.purple,
    ];

    if (role === 'staff' && isLoading && !isRefreshing && leaveBalances.length === 0 && leaveRequests.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.purple} />
                <Text style={styles.loadingText}>Loading leave information...</Text>
            </View>
        );
    }

    if (role === 'staff' && error && leaveBalances.length === 0 && leaveRequests.length === 0) {
        return (
            <View style={styles.errorContainer}>
                <Icon name="alert-triangle" size={48} color={theme.colors.danger} />
                <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
                <Text style={styles.errorSubTitle}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => fetchLeaveData(true)}>
                    <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    role === 'staff' && empId ? (
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                            colors={[theme.colors.purple]}
                            tintColor={theme.colors.purple}
                        />
                    ) : undefined
                }
            >
                {/* Main Balance Hero Replaced with HeroCard */}
                <View style={styles.heroWrapper}>
                    <HeroCard
                        colors={theme.gradients.blue}
                        topIcon="calendar"
                        topLabel={isManager ? "Pending Requests" : "Leave Balance"}
                        title={isManager ? "2" : String(totalBalance)}
                        titleStyle={styles.heroValue}
                        subtitle={isManager ? "Days remaining" : "Remaining"}
                    />
                </View>

                {role === 'staff' && leaveBalances.length > 0 && (
                    <View style={styles.sectionCard}>
                        <Text style={styles.sectionTitle}>Leave Balances</Text>
                        {leaveBalances.map((item, index) => {
                            const total = Math.max(item.allowLeavePerMonth || 0, item.balance || 0);
                            const used = Math.max(0, total - (item.balance || 0));
                            const barColor = progressColors[index % progressColors.length];

                            return (
                                <View key={item.empLeaveBalanceID || String(index)}>
                                    {index > 0 && <View style={styles.divider} />}
                                    <ProgressBar
                                        label={item.leaveTypeName || 'Leave'}
                                        used={used}
                                        total={total}
                                        color={barColor}
                                    />
                                </View>
                            );
                        })}
                    </View>
                )}

                {role === 'staff' && (
                    <Text style={styles.listTitle}>My Requests</Text>
                )}

                {/* Requests List */}
                <View style={styles.listContainer}>
                    {leaveRequests.map((request) => (
                        <LeaveRequestCard
                            key={request.id}
                            request={request}
                            onPress={() => navigation.navigate('LeaveDetail', { id: request.id, request })}
                        />
                    ))}
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
        paddingBottom: 40,
    },
    heroWrapper: {
        marginTop: 20,
    },
    heroValue: {
        fontSize: 48,
        fontWeight: '800',
        marginBottom: 4,
    },
    // The rest of the styles remain unchanged
    sectionCard: {
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
        marginBottom: 24,
        marginHorizontal: 16, // Added to align with HeroCard
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.textStrong,
        marginBottom: 20,
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.surfaceSubtle,
        marginVertical: 16,
    },
    progressContainer: {
        width: '100%',
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    progressLabel: {
        fontSize: 15,
        color: theme.colors.textBody,
    },
    progressValue: {
        fontSize: 15,
        fontWeight: '600',
        color: theme.colors.textStrong,
    },
    progressTrack: {
        height: 8,
        backgroundColor: theme.colors.surfaceSubtle,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    listTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.textStrong,
        marginBottom: 16,
        marginHorizontal: 16, // Added to align with HeroCard
    },
    listContainer: {
        gap: 12,
        marginHorizontal: 16, // Added to align with HeroCard
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
});