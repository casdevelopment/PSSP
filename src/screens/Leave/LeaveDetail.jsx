import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';
import { useAuthStore } from '../../store/AuthStore';
// Make sure to adjust this import path to match your folder structure
import { SectionCard, DetailRow } from '../../components/SectionCard';

const LEAVE_DETAILS = {
    '1': {
        title: 'Sick Leave',
        status: 'Pending',
        statusTone: 'pending',
        duration: '3',
        durationLabel: 'days',
        dateRange: 'May 1, 2026 - May 3, 2026',
        employeeRole: 'Teacher',
        employeeName: 'John Smith',
        school: 'Greenwood High School',
        subject: 'Mathematics',
        leaveType: 'Sick Leave',
        reason: 'Medical appointment and recovery. Need to attend scheduled medical procedure and follow-up care.',
        appliedOn: 'Apr 28, 2026',
        substituteTeacher: 'Emma Wilson',
        timeline: null,
    },
    '2': {
        title: 'Casual Leave',
        status: 'Approved',
        statusTone: 'approved',
        duration: '1',
        durationLabel: 'day',
        dateRange: 'Apr 20, 2026 - Apr 20, 2026',
        leaveType: 'Casual Leave',
        reason: 'Personal work',
        appliedOn: 'Apr 18, 2026',
        timeline: [
            { label: 'Applied On', date: 'Apr 18, 2026', icon: 'clock', color: '#2563EB' },
            { label: 'Approved On', date: 'Apr 19, 2026', by: 'Sarah Johnson', icon: 'check', color: '#16A34A' },
        ],
        approvedMessage: 'Your leave request has been approved',
    },
};

const STATUS_THEME = {
    approved: {
        pillBg: '#D7F9E6',
        pillText: '#107C41',
        bannerBg: '#F0FDF4',
        bannerIconBg: '#DCFCE7',
        bannerIcon: '#16A34A',
        bannerTitle: '#166534',
        bannerText: '#15803D',
    },
    pending: {
        pillBg: theme.colors.pendingChipBg,
        pillText: theme.colors.pendingChipText,
        bannerBg: '#FFF7ED',
        bannerIconBg: '#FFEDD5',
        bannerIcon: '#EA580C',
        bannerTitle: '#9A3412',
        bannerText: '#C2410C',
    },
};

export default function LeaveDetail() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();
    const user = useAuthStore((state) => state.user);
    const requestId = route.params?.id || '1';
    const detail = LEAVE_DETAILS[requestId] || LEAVE_DETAILS['1'];
    const stylesByStatus = STATUS_THEME[detail.statusTone] || STATUS_THEME.pending;

    const role = user?.role || 'staff'; 
    const isReviewer = role === 'principal' || role === 'coordinator';

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.linkPrimary} />

            {/* Background Header */}
            <View style={[styles.headerBg, { paddingTop: insets.top }]}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="chevron-left" size={24} color={theme.colors.white} />
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.headerTitle}>Leave Request</Text>
                <Text style={styles.headerSubtitle}>{detail.title}</Text>
            </View>

            {/* Hero Card */}
            <View style={[styles.heroCard, theme.shadow.card]}>
                <Text style={styles.heroLabel}>Duration</Text>

                <View style={styles.durationRow}>
                    <Text style={styles.durationValue}>{detail.duration}</Text>
                    <View style={[styles.statusPill, { backgroundColor: stylesByStatus.pillBg }]}>
                        <Text style={[styles.statusPillText, { color: stylesByStatus.pillText }]}>
                            {detail.status}
                        </Text>
                    </View>
                </View>
                <Text style={styles.durationUnit}>{detail.durationLabel}</Text>

                <View style={styles.heroDivider} />

                <View style={styles.dateRow}>
                    <Icon name="calendar" size={theme.iconSize.md} color={theme.colors.textBody} />
                    <Text style={styles.dateText}>{detail.dateRange}</Text>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: insets.bottom + theme.spacing.lg },
                ]}
            >
                {isReviewer && (
                    <SectionCard title="Employee Information">
                        <DetailRow
                            label={detail.employeeRole}
                            value={detail.employeeName}
                            icon="user"
                            iconBg="#E8F0FE"
                            iconColor="#2563EB"
                        />
                        <DetailRow
                            label="School"
                            value={detail.school}
                            icon="trello"
                            iconBg="#F3E8FF"
                            iconColor="#9333EA"
                        />
                        <DetailRow
                            label="Subject"
                            value={detail.subject}
                            icon="clock"
                            iconBg="#DCFCE7"
                            iconColor="#16A34A"
                        />
                    </SectionCard>
                )}

                <SectionCard title="Leave Type">
                    <View style={styles.chipRow}>
                        <View style={styles.leaveChip}>
                            <Text style={styles.leaveChipText}>{detail.leaveType}</Text>
                        </View>
                    </View>
                </SectionCard>

                <SectionCard title="Reason">
                    <Text style={styles.reasonText}>{detail.reason}</Text>
                </SectionCard>

                <SectionCard title="Timeline">
                    <DetailRow
                        label="Applied On"
                        value={detail.timeline?.[0]?.date || detail.appliedOn}
                        icon="clock"
                        iconBg="#E8F0FE"
                        iconColor="#2563EB"
                    />
                    {detail.status === 'Approved' && (
                        <>
                            <DetailRow
                                label="Approved On"
                                value={detail.timeline?.[1]?.date || 'Apr 19, 2026'}
                                icon="check"
                                iconBg="#DCFCE7"
                                iconColor="#16A34A"
                            />
                            <Text style={styles.timelineBy}>by {detail.timeline?.[1]?.by || 'Sarah Johnson'}</Text>
                        </>
                    )}
                </SectionCard>

                {!isReviewer && (
                    <View style={[styles.approvedBanner, { backgroundColor: stylesByStatus.bannerBg }]}>
                        <View style={[styles.bannerIconWrap, { backgroundColor: stylesByStatus.bannerIconBg }]}>
                            <Icon 
                                name={detail.status === 'Pending' ? 'clock' : 'check'} 
                                size={22} 
                                color={stylesByStatus.bannerIcon} 
                            />
                        </View>
                        <View style={styles.bannerTextWrap}>
                            <Text style={[styles.bannerTitle, { color: stylesByStatus.bannerTitle }]}>
                                {detail.status === 'Pending' ? 'Awaiting Approval' : 'Leave Approved'}
                            </Text>
                            <Text style={[styles.bannerText, { color: stylesByStatus.bannerText }]}>
                                {detail.status === 'Pending' ? 'Your request is being reviewed' : 'Your leave request has been approved'}
                            </Text>
                        </View>
                    </View>
                )}

                {isReviewer && detail.status === 'Pending' && (
                    <View style={styles.actionBar}>
                        <TouchableOpacity style={styles.rejectButton} activeOpacity={0.85} onPress={() => { }}>
                            <Icon name="x" size={20} color="#B91C1C" />
                            <Text style={styles.rejectText}>Reject</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.approveButton} activeOpacity={0.85} onPress={() => { }}>
                            <Icon name="check" size={20} color={theme.colors.white} />
                            <Text style={styles.approveText}>Approve</Text>
                        </TouchableOpacity>
                    </View>
                )}
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
        backgroundColor: theme.colors.linkPrimary,
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
        color: '#FFF',
        fontSize: 16,
        fontWeight: '500',
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 4,
        marginTop: 8,
    },
    headerSubtitle: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.8)',
    },
    scrollContent: {
        paddingTop: 0,
    },
    heroCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        marginHorizontal: 16,
        marginTop: -30,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
        ...theme.shadow.card,
    },
    heroLabel: {
        color: theme.colors.textMuted,
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4,
    },
    statusPill: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: theme.radius.md,
    },
    statusPillText: {
        fontSize: 13,
        fontWeight: '600',
    },
    durationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    durationValue: {
        color: theme.colors.textHeading,
        fontSize: 38,
        fontWeight: '700',
    },
    durationUnit: {
        color: theme.colors.textMuted,
        fontSize: 14,
        marginTop: -4,
        marginBottom: 16,
    },
    heroDivider: {
        height: 1,
        backgroundColor: theme.colors.borderSubtle,
        marginBottom: 16,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        color: theme.colors.textBody,
        fontSize: 14,
        marginLeft: 8,
    },
    chipRow: {
        flexDirection: 'row',
    },
    leaveChip: {
        backgroundColor: '#F0F5FF',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    leaveChipText: {
        color: theme.colors.linkPrimary,
        fontSize: 14,
        fontWeight: '500',
    },
    reasonText: {
        color: theme.colors.textBody,
        fontSize: 15,
        lineHeight: 22,
    },
    timelineBy: {
        color: theme.colors.textBody,
        fontSize: 13,
        marginLeft: 52,
        marginTop: -8,
    },
    approvedBanner: {
        borderRadius: 16,
        marginHorizontal: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 16,
    },
    bannerIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bannerTextWrap: {
        flex: 1,
    },
    bannerTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    bannerText: {
        fontSize: 14,
        lineHeight: 20,
    },
    actionBar: {
        flexDirection: 'row',
        gap: 12,
        marginHorizontal: 16,
        marginTop: 4,
        backgroundColor: 'transparent',
    },
    rejectButton: {
        flex: 1,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#FFF1F2',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    rejectText: {
        color: '#9F1239',
        fontSize: 15,
        fontWeight: '600',
    },
    approveButton: {
        flex: 1,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#059669',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    approveText: {
        color: theme.colors.white,
        fontSize: 15,
        fontWeight: '500',
    },
});