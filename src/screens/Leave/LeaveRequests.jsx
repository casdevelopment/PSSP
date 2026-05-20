import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme/theme';
import LeaveRequestCard from '../../components/LeaveRequestCard';
import { useAuthStore } from '../../store/AuthStore';

export const LEAVE_REQUESTS = [
    {
        id: '1',
        type: 'Sick Leave',
        status: 'Pending',
        appliedDate: 'Apr 28, 2026',
        duration: '2 days',
        period: 'May 1 - May 2',
    },
    {
        id: '2',
        type: 'Casual Leave',
        status: 'Approved',
        appliedDate: 'Apr 18, 2026',
        duration: '1 day',
        period: 'Apr 20 - Apr 20',
    },
    {
        id: '3',
        type: 'Personal Leave',
        status: 'Approved',
        appliedDate: 'Apr 1, 2026',
        duration: '3 days',
        period: 'Apr 5 - Apr 7',
    },
];

const ProgressBar = ({ label, used, total, color }) => {
    const percentage = (used / total) * 100;

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
    const user = useAuthStore((state) => state.user);
    const role = user?.role;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Main Balance Hero */}
                <LinearGradient
                    colors={theme.gradients.blue}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.heroCard, theme.shadow.hero]}
                >
                    <View style={styles.heroTop}>
                        <Icon
                            name="calendar"
                            size={20}
                            color={theme.colors.white}
                            style={styles.heroIcon}
                        />
                        {role === 'principal' || role === 'coordinator' ? (
                            <Text style={styles.heroLabel}>Pending Requests</Text>
                        ) : (
                            <Text style={styles.heroLabel}>Leave Balance</Text>
                        )}
                    </View>

                    <Text style={styles.heroValue}>2</Text>
                    {role === 'principal' || role === 'coordinator' ? (
                        <Text style={styles.heroSubText}>Days remaining</Text>
                    ) : (
                        <Text style={styles.heroSubText}>Remaining</Text>
                    )}
                </LinearGradient>

                {role === 'staff' && (
                    <View style={styles.sectionCard}>
                        <Text style={styles.sectionTitle}>Leave Balances</Text>
                        <ProgressBar
                            label="Sick Leave"
                            used={2}
                            total={10}
                            color={theme.colors.linkPrimary}
                        />

                        <View style={styles.divider} />

                        <ProgressBar
                            label="Casual Leave"
                            used={4}
                            total={12}
                            color={theme.colors.success}
                        />

                        <View style={styles.divider} />

                        <ProgressBar
                            label="Personal Leave"
                            used={3}
                            total={8}
                            color={theme.colors.accentPurple}
                        />
                    </View>
                )}
                
                {role === 'staff' && (
                    <Text style={styles.listTitle}>My Requests</Text>
                )}

                {/* Requests List */}
                <View style={styles.listContainer}>
                    {LEAVE_REQUESTS.map((request) => (
                        <LeaveRequestCard
                            key={request.id}
                            request={request}
                            onPress={() => navigation.navigate('LeaveDetail', { id: request.id })}
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
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    heroCard: {
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
        marginTop: 20,
    },
    heroTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    heroIcon: {
        marginRight: 8,
    },
    heroLabel: {
        color: theme.colors.white90,
        fontSize: 16,
        fontWeight: '500',
    },
    heroValue: {
        color: theme.colors.white,
        fontSize: 48,
        fontWeight: '800',
        marginBottom: 4,
    },
    heroSubText: {
        color: theme.colors.white80,
        fontSize: 14,
    },
    sectionCard: {
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
        marginBottom: 24,
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
    },
    listContainer: {
        gap: 12,
    },
});