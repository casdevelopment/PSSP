import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';
import { useAuthStore } from '../../store/AuthStore';
import { getEmpAllLeaveListHistory, approveStaffAndPrincipalLeaveRequest, rejectStaffAndPrincipalLeaveRequest } from '../../network/apis';
import { useProfileDetailsStore } from '../../store/ProfileDetailsStore';
import RejectModal from '../../components/RejectModal';
// Make sure to adjust this import path to match your folder structure
import { SectionCard, DetailRow } from '../../components/SectionCard';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';

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

const formatRequestObj = (item) => {
    const isApproved = item.approved === true;
    const isRejected = item.isRejected === true;
    const status = isApproved ? 'Approved' : isRejected ? 'Rejected' : 'Pending';
    const statusTone = isApproved ? 'approved' : isRejected ? 'rejected' : 'pending';
    const days = item.days || 1;

    const fromDateFormatted = formatDate(item.fromDate);
    const toDateFormatted = formatDate(item.toDate);
    const periodStr = fromDateFormatted === toDateFormatted ? fromDateFormatted : `${fromDateFormatted} - ${toDateFormatted}`;

    return {
        id: String(item.id),
        type: item.entityLeaveType || 'Leave',
        title: item.entityLeaveType || 'Leave',
        status: status,
        statusTone: statusTone,
        duration: String(days),
        durationLabel: days > 1 ? 'days' : 'day',
        dateRange: periodStr,
        employeeRole: 'Staff',
        employeeName: '',
        school: '',
        subject: 'N/A',
        leaveType: item.entityLeaveType || 'Leave',
        reason: item.reason || 'No reason provided',
        rejectedRemarks: item.rejectedRemarks || null,
        appliedOn: formatDate(item.fromDate),
        timeline: [
            { label: 'Applied On', date: formatDate(item.fromDate), icon: 'clock', color: '#2B7FFF' },
            ...(isApproved || isRejected ? [
                {
                    label: isApproved ? 'Approved On' : 'Rejected On',
                    date: formatDate(item.toDate || item.fromDate),
                    icon: isApproved ? 'check' : 'x',
                    color: isApproved ? '#10B981' : '#E11D48'
                }
            ] : [])
        ]
    };
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
    rejected: {
        pillBg: '#FEE2E2',
        pillText: '#B91C1C',
        bannerBg: '#FEF2F2',
        bannerIconBg: '#FEE2E2',
        bannerIcon: '#EF4444',
        bannerTitle: '#991B1B',
        bannerText: '#B91C1C',
    },
};

export default function LeaveDetail() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();
    const empId = useAuthStore((state) => state.empId);
    const username = useAuthStore((state) => state.username);
    const userType = useAuthStore((state) => state.userType);
    const profileDetails = useProfileDetailsStore((state) => state.profileDetails);

    const requestId = route.params?.id || '1';
    const initialRequest = route.params?.request;

    const [detail, setDetail] = useState(initialRequest || null);
    const [isLoading, setIsLoading] = useState(!initialRequest);
    const [error, setError] = useState(null);
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);

    const role = userType || 'staff';
    const isReviewMode = route.params?.isReviewMode === true;
    const isReviewer = isReviewMode && (role === 'principal' || role === 'coordinator');

    const handleApprove = async () => {
        try {
            setIsApproving(true);
            const response = await approveStaffAndPrincipalLeaveRequest(requestId);
            if (response && response.success) {
                setDetail(prev => prev ? {
                    ...prev,
                    status: 'Approved',
                    statusTone: 'approved'
                } : null);
                Alert.alert('Success', response.message || 'Leave successfully approved.', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            } else {
                Alert.alert('Error', response?.message || 'Failed to approve leave request.');
            }
        } catch (err) {
            console.error('Error approving leave:', err);
            Alert.alert('Error', err.message || 'An error occurred while approving leave request.');
        } finally {
            setIsApproving(false);
        }
    };

    const handleReject = async (rejectedRemarks) => {
        try {
            setIsRejecting(true);
            const payload = {
                leaveid: Number(requestId) || 0,
                rejectedRemarks: rejectedRemarks
            };
            const response = await rejectStaffAndPrincipalLeaveRequest(payload);
            if (response && response.success) {
                setDetail(prev => prev ? {
                    ...prev,
                    status: 'Rejected',
                    statusTone: 'rejected',
                    rejectedRemarks: rejectedRemarks
                } : null);
                Alert.alert('Success', response.message || 'Leave successfully rejected.', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            } else {
                Alert.alert('Error', response?.message || 'Failed to reject leave request.');
            }
        } catch (err) {
            console.error('Error rejecting leave:', err);
            Alert.alert('Error', err.message || 'An error occurred while rejecting leave request.');
        } finally {
            setIsRejecting(false);
        }
    };


    const fetchLeaveDetail = useCallback(async () => {
        if (initialRequest) return;
        if (!empId) {
            setError('Missing employee ID');
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const response = await getEmpAllLeaveListHistory(empId);
            if (response && response.success) {
                const rawItem = (response.data || []).find(item => String(item.id) === String(requestId));
                if (rawItem) {
                    const formatted = formatRequestObj(rawItem);
                    formatted.employeeName = profileDetails?.employeeName || username || 'Employee';
                    formatted.school = profileDetails?.schoolName || 'Greenwood High School';
                    formatted.employeeRole = role === 'staff' ? 'Staff' : role === 'principal' ? 'Principal' : 'Coordinator';
                    setDetail(formatted);
                } else {
                    setError('Leave request details not found');
                }
            } else {
                setError(response?.message || 'Failed to load details');
            }
        } catch (err) {
            console.error('Error loading leave detail:', err);
            setError(err.message || 'An error occurred while fetching details');
        } finally {
            setIsLoading(false);
        }
    }, [empId, requestId, initialRequest, role, profileDetails?.employeeName, profileDetails?.schoolName, username]);

    useEffect(() => {
        if (initialRequest) {
            setDetail(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                };
            });
        } else {
            fetchLeaveDetail();
        }
    }, [fetchLeaveDetail, initialRequest, role]);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <StatusBar barStyle="light-content" backgroundColor={theme.colors.linkPrimary} />
                <ActivityIndicator size="large" color={theme.colors.purple} />
                <Text style={styles.loadingText}>Loading details...</Text>
            </View>
        );
    }

    if (error || !detail) {
        return (
            <View style={styles.errorContainer}>
                <StatusBar barStyle="light-content" backgroundColor={theme.colors.linkPrimary} />
                <Icon name="alert-triangle" size={48} color={theme.colors.danger} />
                <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
                <Text style={styles.errorSubTitle}>{error || 'Request detail is unavailable'}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchLeaveDetail}>
                    <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const stylesByStatus = STATUS_THEME[detail.statusTone] || STATUS_THEME.pending;

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

                {detail.rejectedRemarks ? (
                    <SectionCard title="Rejection Remarks">
                        <Text style={styles.reasonText}>{detail.rejectedRemarks}</Text>
                    </SectionCard>
                ) : null}

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

                {/* {!isReviewer && (
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
                )} */}

                {isReviewer && detail.status === 'Pending' && (
                    <View style={styles.actionBar}>
                        <SecondaryButton
                            title="Reject"
                            onPress={() => setShowRejectModal(true)}
                            variant="danger"
                            disabled={isApproving}
                            loading={isRejecting}
                        />

                        <SecondaryButton
                            title="Approve"
                            onPress={handleApprove}
                            loading={isApproving}
                            variant="success"
                        />
                    </View>
                )}
            </ScrollView>

            <RejectModal
                visible={showRejectModal}
                onClose={() => setShowRejectModal(false)}
                onConfirm={(remarksText) => {
                    setShowRejectModal(false);
                    handleReject(remarksText);
                }}
                title="Reject Leave Request"
                subtitle="Please enter remarks for rejecting this leave request."
                placeholder="Enter remarks..."
                isOperating={isRejecting}
            />
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
    primaryApproveButton: {
        flex: 1,
    },
    rejectBtn: {
        flex: 1,
        backgroundColor: '#FEE2E2',
        borderWidth: 1,
        borderColor: '#FCA5A5',
        borderRadius: 12,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rejectBtnText: {
        color: '#DC2626',
        fontSize: 16,
        fontWeight: '700',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.appBackground,
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
        backgroundColor: theme.colors.appBackground,
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