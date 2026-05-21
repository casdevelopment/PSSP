import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme/theme';
import LeaveRequestCard from '../../components/LeaveRequestCard';
import { useAuthStore } from '../../store/AuthStore';

// Adjust the import path based on where you saved your HeroCard component
import HeroCard from '../../components/HeroCard';

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

    // Helper boolean to keep conditional rendering clean
    const isManager = role === 'principal' || role === 'coordinator';

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Main Balance Hero Replaced with HeroCard */}
                <View style={styles.heroWrapper}>
                    <HeroCard
                        colors={theme.gradients.blue}
                        topIcon="calendar"
                        topLabel={isManager ? "Pending Requests" : "Leave Balance"}
                        title="2"
                        titleStyle={styles.heroValue}
                        subtitle={isManager ? "Days remaining" : "Remaining"}
                    />
                </View>

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
        // Removed horizontal padding here because HeroCard applies its own paddingHorizontal: 16.
        // The list items and section cards will span slightly wider now unless they have their own margins,
        // or you can wrap them in a separate padded container if needed.
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
});