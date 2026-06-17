import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme/theme';
import { useAuthStore } from '../store/AuthStore';
import { useLeaveStore } from '../store/LeaveStore';

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

export default function LeaveBalances() {
    const empId = useAuthStore((state) => state.empId);
    const { leaveBalances, isLoadingBalances, error, fetchLeaveBalances } = useLeaveStore();

    useEffect(() => {
        if (empId) {
            fetchLeaveBalances(empId);
        }
    }, [empId, fetchLeaveBalances]);

    if (isLoadingBalances && leaveBalances.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="small" color={theme.colors.purple} />
                <Text style={styles.loadingText}>Loading balances...</Text>
            </View>
        );
    }

    if (error && leaveBalances.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Icon name="alert-circle" size={24} color={theme.colors.danger} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryBtn} onPress={() => fetchLeaveBalances(empId)}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (leaveBalances.length === 0) {
        return null;
    }

    // Dynamic colors for leave progress bars
    const progressColors = [
        theme.colors.linkPrimary,
        theme.colors.success,
        theme.colors.accentPurple,
        theme.colors.warning,
        theme.colors.danger,
        theme.colors.purple,
    ];

    return (
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
    );
}

const styles = StyleSheet.create({
    sectionCard: {
        backgroundColor: theme.colors.white,
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
        ...theme.shadow.card,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.textStrong,
        marginBottom: 20,
    },
    progressContainer: {
        marginBottom: 4,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: theme.colors.textHeading,
    },
    progressValue: {
        fontSize: 14,
        color: theme.colors.textMuted,
        fontWeight: '500',
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
    divider: {
        height: 1,
        backgroundColor: theme.colors.borderSubtle,
        marginVertical: 16,
    },
    centerContainer: {
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.white,
        borderRadius: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
    },
    loadingText: {
        marginTop: 8,
        fontSize: 14,
        color: theme.colors.textMuted,
    },
    errorText: {
        marginTop: 8,
        fontSize: 14,
        color: theme.colors.danger,
        textAlign: 'center',
    },
    retryBtn: {
        marginTop: 12,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: theme.colors.surfaceSubtle,
    },
    retryText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.textHeading,
    },
});
