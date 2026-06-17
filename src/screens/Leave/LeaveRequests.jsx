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
import { getEmpAllLeaveListHistory } from '../../network/apis';
import { useLeaveStore } from '../../store/LeaveStore';
import LeaveBalances from '../../components/LeaveBalances';
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

export default function LeaveRequests() {
    const navigation = useNavigation();
    const empId = useAuthStore((state) => state.empId);
    const role = useAuthStore((state) => state.userType);

    const leaveBalances = useLeaveStore((state) => state.leaveBalances);

    const [leaveRequests, setLeaveRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const fetchLeaveData = useCallback(async (showLoader = true) => {
        if (!empId) return;
        try {
            if (showLoader) setIsLoading(true);
            setError(null);

            const historyRes = await getEmpAllLeaveListHistory(empId).catch(err => {
                console.error('Error fetching history:', err);
                return null;
            });

            if (historyRes && historyRes.success) {
                const mapped = (historyRes.data || []).map(item => {
                    const status = item.approved === true ? 'Approved' : item.approved === false ? 'Pending' : 'Pending';
                    const statusTone = item.approved === true ? 'approved' : item.approved === false ? 'pending' : 'pending';
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
                        rawItem: item,
                    };
                });
                setLeaveRequests(mapped);
            }

            if (!historyRes || !historyRes.success) {
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
        if (empId) {
            fetchLeaveData(true);
        }
    }, [fetchLeaveData, empId]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchLeaveData(false);
    };

    // Calculate total balance for staff
    const totalBalance = leaveBalances.reduce((sum, item) => sum + (item.balance || 0), 0);

    if (isLoading && !isRefreshing && leaveBalances.length === 0 && leaveRequests.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.purple} />
                <Text style={styles.loadingText}>Loading leave information...</Text>
            </View>
        );
    }

    if (error && leaveBalances.length === 0 && leaveRequests.length === 0) {
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
                    empId ? (
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
                        topLabel="Leave Balance"
                        title={String(totalBalance)}
                        titleStyle={styles.heroValue}
                        subtitle="Remaining"
                    />
                </View>

                <LeaveBalances />

                <Text style={styles.listTitle}>My Requests</Text>

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