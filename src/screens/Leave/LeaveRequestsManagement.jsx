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
import { getUnapprovedStaffLeaveRequest } from '../../network/apis';
import HeroCard from '../../components/HeroCard';

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

export default function LeaveRequestsManagement() {
    const navigation = useNavigation();
    const schoolId = useAuthStore((state) => state.schoolId);

    const [leaveRequests, setLeaveRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const fetchLeaveData = useCallback(async (showLoader = true) => {
        try {
            if (showLoader) setIsLoading(true);
            setError(null);

            const response = await getUnapprovedStaffLeaveRequest(schoolId).catch(err => {
                console.error('Error fetching pending requests:', err);
                return null;
            });

            if (response && response.success) {
                const mapped = (response.data || []).map(item => {
                    const status = 'Pending';
                    const statusTone = 'pending';
                    const days = item.days || 1;
                    const durationStr = `${days} day${days > 1 ? 's' : ''}`;

                    const fromDateFormatted = formatDate(item.fromDate);
                    const toDateFormatted = formatDate(item.toDate);
                    const periodStr = fromDateFormatted === toDateFormatted ? fromDateFormatted : `${fromDateFormatted} - ${toDateFormatted}`;

                    return {
                        id: String(item.id),
                        employeeName: item.firstName || item.employeeName || item.empName || item.name || 'Staff Member',
                        type: item.leaveTypeName || item.entityLeaveType || item.leaveType || 'Leave',
                        status: status,
                        statusTone: statusTone,
                        appliedDate: formatDate(item.appliedDate || item.fromDate),
                        duration: durationStr,
                        period: periodStr,
                        days: days,
                        dateRange: periodStr,
                        reason: item.reason || 'No reason provided',
                        leaveType: item.leaveTypeName || item.entityLeaveType || item.leaveType || 'Leave',
                        appliedOn: formatDate(item.appliedDate || item.fromDate),
                        rawItem: item,
                    };
                });
                setLeaveRequests(mapped);
            }

            if (!response || !response.success) {
                setError(response?.message || 'Failed to load pending requests');
            }
        } catch (err) {
            console.error('Error fetching leave data:', err);
            setError(err.message || 'An error occurred while fetching leave data');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [schoolId]);

    useEffect(() => {
        fetchLeaveData(true);
    }, [fetchLeaveData]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchLeaveData(false);
    };

    const pendingCount = leaveRequests.filter(r => r.status === 'Pending').length;

    if (isLoading && !isRefreshing && leaveRequests.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.purple} />
                <Text style={styles.loadingText}>Loading leave requests...</Text>
            </View>
        );
    }

    if (error && leaveRequests.length === 0) {
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
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        colors={[theme.colors.purple]}
                        tintColor={theme.colors.purple}
                    />
                }
            >
                <View style={styles.heroWrapper}>
                    <HeroCard
                        colors={theme.gradients.blue}
                        topIcon="calendar"
                        topLabel="Pending Requests"
                        title={String(pendingCount)}
                        titleStyle={styles.heroValue}
                        subtitle="Awaiting approval"
                    />
                </View>

                <Text style={styles.listTitle}>All Requests</Text>

                <View style={styles.listContainer}>
                    {leaveRequests.map((request) => (
                        <LeaveRequestCard
                            key={request.id}
                            request={request}
                            onPress={() => navigation.navigate('LeaveDetail', { id: request.id, request })}
                        />
                    ))}
                    {leaveRequests.length === 0 && (
                        <View style={styles.emptyContainer}>
                            <Icon name="check-circle" size={48} color={theme.colors.success} style={styles.emptyIcon} />
                            <Text style={styles.emptyText}>No pending leave requests</Text>
                        </View>
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
    listTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.textStrong,
        marginBottom: 16,
        marginHorizontal: 16,
    },
    listContainer: {
        gap: 12,
        marginHorizontal: 16,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
    },
    emptyIcon: {
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
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
});
