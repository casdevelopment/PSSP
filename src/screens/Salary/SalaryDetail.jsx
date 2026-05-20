import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';

export default function SalaryDetail() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();

    const month = route.params?.month || 'March 2026';
    const amount = route.params?.amount || '$3,200';

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
                    <Text style={styles.pageTitle}>Salary Details</Text>
                    <Text style={styles.pageSubtitle}>{month}</Text>
                </View>
            </View>


            {/* Total Amount Card (Floating) */}
            <View style={[styles.amountCard, theme.shadow.card]}>
                <View style={styles.amountTop}>
                    <View>
                        <Text style={styles.amountLabel}>Total Amount</Text>
                        <Text style={styles.amountValue}>{amount}</Text>
                    </View>
                    <View style={styles.checkCircleLarge}>
                        <Icon name="check" size={24} color={theme.colors.successStrong} />
                    </View>
                </View>
                <View style={styles.amountBottom}>
                    <Icon name="calendar" size={14} color={theme.colors.textMuted} style={{ marginRight: 8 }} />
                    <Text style={styles.dateText}>Received on Mar 25, 2026</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Payment Status */}
                <View style={styles.SectionCard}>
                    <Text style={styles.sectionTitle}>Payment Status</Text>
                    <View style={styles.statusCard}>
                        <View style={styles.statusIconCircle}>
                            <Icon name="check" size={16} color={theme.colors.successStrong} />
                        </View>
                        <View>
                            <Text style={styles.statusTitle}>Payment Received</Text>
                            <Text style={styles.statusSubtitle}>Successfully acknowledged</Text>
                        </View>
                    </View>
                </View>

                {/* Salary Breakdown */}
                <View style={styles.SectionCard}>
                    <Text style={styles.sectionTitle}>Salary Breakdown</Text>

                    <View style={styles.breakdownRow}>
                        <Text style={styles.breakdownLabel}>Base Salary</Text>
                        <Text style={styles.breakdownValue}>$2,800</Text>
                    </View>
                    <View style={styles.breakdownRow}>
                        <Text style={styles.breakdownLabel}>Allowances</Text>
                        <Text style={styles.breakdownValue}>$400</Text>
                    </View>
                    <View style={styles.breakdownRow}>
                        <Text style={styles.breakdownLabel}>Deductions</Text>
                        <Text style={[styles.breakdownValue, { color: theme.colors.danger }]}>$0</Text>
                    </View>
                    <View style={styles.breakdownRow}>
                        <Text style={styles.breakdownLabel}>Taxes</Text>
                        <Text style={[styles.breakdownValue, { color: theme.colors.danger }]}>$0</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Net Salary</Text>
                        <Text style={styles.totalAmount}>{amount}</Text>
                    </View>
                </View>

                {/* Large Download Button */}
                <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.8}>
                    <Icon name="download" size={20} color={theme.colors.white} style={{ marginRight: 8 }} />
                    <Text style={styles.primaryBtnText}>Download Payslip</Text>
                </TouchableOpacity>

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
        fontSize: 16,
        color: theme.colors.white90,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 40,
        marginTop: -15,
    },
    amountCard: {
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        padding: 24,
        marginTop: -30,
        marginBottom: 10,
        marginHorizontal: 16,
    },
    amountTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    amountLabel: {
        fontSize: 14,
        color: theme.colors.textMuted,
        marginBottom: 4,
    },
    amountValue: {
        fontSize: 36,
        fontWeight: '800',
        color: theme.colors.textHeading,
    },
    checkCircleLarge: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: theme.colors.successSubtle,
        alignItems: 'center',
        justifyContent: 'center',
    },
    amountBottom: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: theme.colors.surfaceSubtle,
        paddingTop: 16,
    },
    dateText: {
        fontSize: 14,
        color: theme.colors.textBody,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.textHeading,
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    statusCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.successSubtle,
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
    },
    statusIconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    statusTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.successStrong,
        marginBottom: 2,
    },
    statusSubtitle: {
        fontSize: 13,
        color: theme.colors.successStrong,
        opacity: 0.8,
    },
    SectionCard: {
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 10,
        borderWidth: 1,
        marginTop: 10,
        borderColor: theme.colors.borderSubtle,
    },
    breakdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
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
    primaryBtn: {
        flexDirection: 'row',
        backgroundColor: theme.colors.linkPrimary,
        paddingVertical: 18,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryBtnText: {
        color: theme.colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
});