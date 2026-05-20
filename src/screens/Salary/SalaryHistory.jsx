import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';

export default function SalaryHistory() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const RECORDS = [
        { id: '1', month: 'April 2026', amount: '$5,200', base: '$4,500', allow: '$700', deduct: '$0', date: 'Apr 30, 2026', paid: true },
        { id: '2', month: 'March 2026', amount: '$5,200', base: '$4,500', allow: '$700', deduct: '$0', date: 'Mar 31, 2026', paid: true },
        { id: '3', month: 'February 2026', amount: '$5,200', base: '$4,500', allow: '$700', deduct: '$0', date: 'Feb 28, 2026', paid: true },
        { id: '4', month: 'January 2026', amount: '$5,200', base: '$4,500', allow: '$700', deduct: '$0', date: 'Jan 31, 2026', paid: true },
    ];

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
                        <Icon name="dollar-sign" size={14} color={theme.colors.successStrong} />
                        <Text style={[styles.statLabel, { color: theme.colors.successStrong }]}>Total (2026)</Text>
                    </View>
                    <Text style={[styles.statValue, { color: theme.colors.successStrong }]}>$20,800</Text>
                </View>

                <View style={[styles.statBox, { backgroundColor: theme.colors.blueSurface }]}>
                    <View style={styles.statLabelRow}>
                        <Icon name="trending-up" size={14} color={theme.colors.linkPrimary} />
                        <Text style={[styles.statLabel, { color: theme.colors.linkPrimary }]}>Average</Text>
                    </View>
                    <Text style={[styles.statValue, { color: theme.colors.linkPrimary }]}>$5,200</Text>
                </View>
            </View>

                {/* Year Tabs */}
                <View style={styles.tabsRow}>
                    <TouchableOpacity style={styles.activeTab}>
                        <Text style={styles.activeTabText}>2026</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.inactiveTab}>
                        <Text style={styles.inactiveTabText}>2025</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.inactiveTab}>
                        <Text style={styles.inactiveTabText}>2024</Text>
                    </TouchableOpacity>
                </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Payment Records Header */}
                <View style={styles.listHeaderRow}>
                    <Text style={styles.sectionTitle}>Payment Records</Text>
                    <Text style={styles.recordsCount}>4 payments</Text>
                </View>

                {/* Cards */}
                {RECORDS.map((record) => (
                    <TouchableOpacity
                        key={record.id}
                        style={styles.recordCard}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('SalaryDetail', { month: record.month, amount: record.amount })}
                    >
                        <View style={styles.recordTop}>
                            <View style={styles.monthRow}>
                                <Icon name="calendar" size={16} color={theme.colors.successStrong} style={{ marginRight: 8 }} />
                                <Text style={styles.recordMonth}>{record.month}</Text>
                            </View>
                            <View style={styles.paidBadge}>
                                <Text style={styles.paidBadgeText}>Paid</Text>
                            </View>
                        </View>

                        <View style={styles.amountRow}>
                            <Text style={styles.recordAmount}>{record.amount}</Text>
                            <TouchableOpacity style={styles.downloadRow}>
                                <Icon name="download" size={14} color={theme.colors.linkPrimary} style={{ marginRight: 4 }} />
                                <Text style={styles.downloadText}>Download</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.breakdownGrid}>
                            <View style={styles.gridItem}>
                                <Text style={styles.gridLabel}>Base</Text>
                                <Text style={styles.gridValue}>{record.base}</Text>
                            </View>
                            <View style={styles.gridItem}>
                                <Text style={styles.gridLabel}>Allowances</Text>
                                <Text style={styles.gridValue}>{record.allow}</Text>
                            </View>
                            <View style={styles.gridItem}>
                                <Text style={styles.gridLabel}>Deductions</Text>
                                <Text style={styles.gridValue}>{record.deduct}</Text>
                            </View>
                        </View>

                        <Text style={styles.paidDateText}>Paid on {record.date}</Text>
                    </TouchableOpacity>
                ))}

                {/* Earnings Breakdown Bottom */}
                <View style={styles.breakdownCard}>
                    <Text style={styles.sectionTitle}>Earnings Breakdown (2026)</Text>

                    <View style={styles.breakdownRow}>
                        <Text style={styles.breakdownLabel}>Total Base Salary</Text>
                        <Text style={styles.breakdownValue}>$18,000</Text>
                    </View>
                    <View style={styles.breakdownRow}>
                        <Text style={styles.breakdownLabel}>Total Allowances</Text>
                        <Text style={styles.breakdownValue}>$2,800</Text>
                    </View>
                    <View style={styles.breakdownRow}>
                        <Text style={styles.breakdownLabel}>Total Deductions</Text>
                        <Text style={styles.breakdownValue}>$0</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Net Earnings</Text>
                        <Text style={styles.totalAmount}>$20,800</Text>
                    </View>
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