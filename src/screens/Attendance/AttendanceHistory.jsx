import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';

const DUMMY_STAFF_HISTORY = [
    { id: '1', date: 'Apr 29, 2026', present: 30, absent: 1, late: 1, percent: 94 },
    { id: '2', date: 'Apr 28, 2026', present: 31, absent: 1, late: 0, percent: 97 },
    { id: '3', date: 'Apr 27, 2026', present: 32, absent: 0, late: 0, percent: 100 },
    { id: '4', date: 'Apr 26, 2026', present: 29, absent: 2, late: 1, percent: 91 },
    { id: '5', date: 'Apr 25, 2026', present: 30, absent: 1, late: 1, percent: 94 },
];

const DUMMY_STUDENT_HISTORY = [
    { id: '1', date: 'Apr 29, 2026', subtitle: 'Grade 10-A', present: 43, absent: 1, late: 1, percent: 96 },
    { id: '2', date: 'Apr 28, 2026', subtitle: 'Grade 10-B', present: 40, absent: 2, late: 0, percent: 95 },
    { id: '3', date: 'Apr 27, 2026', subtitle: 'Grade 11-A', present: 38, absent: 0, late: 2, percent: 95 },
    { id: '4', date: 'Apr 26, 2026', subtitle: 'Grade 10-A', present: 44, absent: 1, late: 0, percent: 98 },
    { id: '5', date: 'Apr 25, 2026', subtitle: 'Grade 10-B', present: 41, absent: 1, late: 0, percent: 98 },
];

const StatChip = ({ value, label, type }) => {
    let textColor = theme.colors.black;
    let bgColor = theme.colors.white;

    if (type === 'present') {
        textColor = theme.colors.success;
        bgColor = theme.colors.successSubtle;
    } else if (type === 'absent') {
        textColor = theme.colors.danger;
        bgColor = theme.colors.dangerSubtle;
    } else if (type === 'late') {
        textColor = theme.colors.warning;
        bgColor = theme.colors.warningSubtle;
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

    const type = route.params?.type || 'staff';
    const isStudent = type === 'student';

    const historyData = isStudent ? DUMMY_STUDENT_HISTORY : DUMMY_STAFF_HISTORY;

    const topStats = isStudent
        ? [
            { value: '15', label: 'Classes', color: theme.colors.linkPrimary },
            { value: '206', label: 'Present', color: theme.colors.success },
            { value: '5', label: 'Absent', color: theme.colors.danger }
        ]
        : [
            { value: '152', label: 'Present', color: theme.colors.success },
            { value: '5', label: 'Absent', color: theme.colors.danger },
            { value: '3', label: 'Late', color: theme.colors.warning }
        ];

    const getPercentStyle = (percent) => {
        if (percent >= 95) {
            return { bg: theme.colors.successSubtle, text: theme.colors.success };
        }
        return { bg: theme.colors.warningSubtle, text: theme.colors.warning };
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
                <Text style={styles.headerSubtitle}>Last 7 days</Text>
            </View>

            {/* Summary Card */}
            <View style={[styles.summaryCard, theme.shadow.card]}>
                <View style={styles.summaryTop}>
                    <View style={styles.averageIconCircle}>
                        <Icon name="trending-up" size={24} color={theme.colors.purple} />
                    </View>
                    <View style={styles.averageInfo}>
                        <Text style={styles.averageLabel}>Weekly Average</Text>
                        <Text style={styles.averageValue}>{isStudent ? '96%' : '95%'}</Text>
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
                {/* History List */}
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
                                    <StatChip value={item.late} label="Late" type="late" />
                                </View>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
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
        paddingBottom: 60,
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
});