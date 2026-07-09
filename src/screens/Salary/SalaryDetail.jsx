import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';
import { useAuthStore } from '../../store/AuthStore';
import { getEmployeeSalaryDetails, updateSalaryAcknowledgement, saveSalaryNotAcknowledgement } from '../../network/apis';
import RejectModal from '../../components/RejectModal';
import SecondaryButton from '../../components/SecondaryButton';

export default function SalaryDetail() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();
    const empId = useAuthStore((state) => state.empId);

    const registerMasterId = route.params?.registerMasterId;
    const month = route.params?.month || 'Selected Month';
    const amount = route.params?.amount || 'PKR 0';
    const initialStatus = route.params?.salaryStatus || 'Pending';

    const [details, setDetails] = useState([]);
    const [salaryStatus, setSalaryStatus] = useState(initialStatus);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isNotPaidModalVisible, setIsNotPaidModalVisible] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!registerMasterId) {
                setLoading(false);
                return;
            }
            try {
                const res = await getEmployeeSalaryDetails(empId, registerMasterId);
                if (res?.success) {
                    setDetails(res.data || []);
                }
            } catch (error) {
                console.error('Error fetching employee salary details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [empId, registerMasterId]);

    const handleAcknowledge = async () => {
        if (submitting) return;
        setSubmitting(true);
        try {
            const res = await updateSalaryAcknowledgement(empId, registerMasterId);
            if (res?.success) {
                Alert.alert('Success', 'This salary record has been acknowledged.');
                setSalaryStatus('Acknowledged');
            } else {
                Alert.alert('Error', res?.message || 'Failed to acknowledge salary.');
            }
        } catch (error) {
            console.error('Acknowledgement error:', error);
            Alert.alert('Error', 'An error occurred while acknowledging salary.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleReportNotPaid = async (remarksText) => {
        if (submitting) return;
        setSubmitting(true);
        try {
            const payload = {
                empId: Number(empId) || 0,
                registerId: Number(registerMasterId) || 0,
                remarks: remarksText.trim(),
            };

            const res = await saveSalaryNotAcknowledgement(payload);
            if (res && res.success) {
                Alert.alert('Success', 'Remarks submitted successfully.', [
                    {
                        text: 'OK',
                        onPress: () => {
                            setSalaryStatus('Not Paid');
                            setIsNotPaidModalVisible(false);
                            navigation.goBack();
                        }
                    }
                ]);
            } else {
                Alert.alert('Error', res?.message || 'Failed to submit remarks.');
            }
        } catch (error) {
            console.error('Submit remarks error:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to submit remarks.';
            Alert.alert('Error', errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    // Filter out total net salary and handle display values
    const breakdownItems = details.filter(item => item.componentName !== 'TOTAL NET SALARY');
    const netSalaryComponent = details.find(item => item.componentName === 'TOTAL NET SALARY');
    const displayTotalAmount = netSalaryComponent ? `PKR ${netSalaryComponent.amount?.toLocaleString()}` : amount;

    const isStatusPaid = salaryStatus?.toLowerCase() === 'paid';
    const isStatusAcknowledged = salaryStatus?.toLowerCase() === 'acknowledged';
    const isStatusNotPaid = salaryStatus?.toLowerCase() === 'not paid';

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.colors.successStrong} />
            </View>
        );
    }

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
                        <Text style={styles.amountValue}>{displayTotalAmount}</Text>
                    </View>
                    <View style={[
                        styles.checkCircleLarge,
                        !isStatusPaid && !isStatusAcknowledged && { backgroundColor: isStatusNotPaid ? theme.colors.dangerSubtle : theme.colors.pendingChipBg }
                    ]}>
                        <Icon
                            name={isStatusPaid || isStatusAcknowledged ? "check" : isStatusNotPaid ? "alert-circle" : "clock"}
                            size={24}
                            color={isStatusPaid || isStatusAcknowledged ? theme.colors.successStrong : isStatusNotPaid ? theme.colors.dangerStrong : theme.colors.pendingChipText}
                        />
                    </View>
                </View>
                <View style={styles.amountBottom}>
                    <Icon name="calendar" size={14} color={theme.colors.textMuted} style={{ marginRight: 8 }} />
                    <Text style={styles.dateText}>Statement Month: {month}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Payment Status */}
                <View style={styles.SectionCard}>
                    <Text style={styles.sectionTitle}>Payment Status</Text>
                    <View style={[
                        styles.statusCard,
                        !isStatusPaid && !isStatusAcknowledged && { backgroundColor: isStatusNotPaid ? theme.colors.dangerSubtle : theme.colors.pendingChipBg }
                    ]}>
                        <View style={styles.statusIconCircle}>
                            <Icon
                                name={isStatusPaid || isStatusAcknowledged ? "check" : isStatusNotPaid ? "alert-circle" : "clock"}
                                size={16}
                                color={isStatusPaid || isStatusAcknowledged ? theme.colors.successStrong : isStatusNotPaid ? theme.colors.dangerStrong : theme.colors.pendingChipText}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[
                                styles.statusTitle,
                                !isStatusPaid && !isStatusAcknowledged && { color: isStatusNotPaid ? theme.colors.dangerStrong : theme.colors.pendingChipText }
                            ]}>
                                {isStatusAcknowledged
                                    ? 'Payment Acknowledged'
                                    : isStatusPaid
                                        ? 'Payment Received'
                                        : isStatusNotPaid
                                            ? 'Reported Unpaid'
                                            : 'Pending Payment'
                                }
                            </Text>
                            <Text style={[
                                styles.statusSubtitle,
                                !isStatusPaid && !isStatusAcknowledged && { color: isStatusNotPaid ? theme.colors.dangerStrong : theme.colors.pendingChipText, opacity: 0.8 }
                            ]}>
                                {isStatusAcknowledged
                                    ? 'Successfully acknowledged'
                                    : isStatusPaid
                                        ? 'Awaiting your acknowledgment'
                                        : isStatusNotPaid
                                            ? 'You reported this salary as unpaid'
                                            : 'Awaiting payment process'
                                }
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Conditional Acknowledgment Action Buttons */}
                {isStatusPaid && (
                    <>
                        <SecondaryButton
                            title="Acknowledge Receipt"
                            onPress={handleAcknowledge}
                            variant="success"
                            icon="check-circle"
                            disabled={submitting}
                            loading={submitting}
                            style={styles.actionBtn}
                        />

                        <SecondaryButton
                            title="Salary Not Paid"
                            onPress={() => setIsNotPaidModalVisible(true)}
                            variant="danger"
                            icon="x-circle"
                            disabled={submitting}
                            style={styles.actionBtnDanger}
                        />
                    </>
                )}

                {/* Remarks Card */}
                {isStatusNotPaid && route.params?.remarks && (
                    <View style={styles.SectionCard}>
                        <Text style={styles.sectionTitle}>Remarks / Reason</Text>
                        <Text style={{ fontSize: 15, color: theme.colors.textBody, lineHeight: 22 }}>
                            {route.params.remarks}
                        </Text>
                    </View>
                )}

                {/* Salary Breakdown */}
                <View style={styles.SectionCard}>
                    <Text style={styles.sectionTitle}>Salary Breakdown</Text>

                    {breakdownItems.length === 0 ? (
                        <Text style={{ textAlign: 'center', color: theme.colors.textMuted, marginVertical: 10 }}>
                            No components found.
                        </Text>
                    ) : (
                        breakdownItems.map((item, idx) => (
                            <View key={idx} style={styles.breakdownRow}>
                                <Text style={styles.breakdownLabel}>{item.componentName}</Text>
                                <Text style={[
                                    styles.breakdownValue,
                                    item.amount < 0 && { color: theme.colors.danger }
                                ]}>
                                    {item.amount < 0
                                        ? `PKR - ${Math.abs(item.amount).toLocaleString()}`
                                        : `PKR ${item.amount.toLocaleString()}`
                                    }
                                </Text>
                            </View>
                        ))
                    )}

                    <View style={styles.divider} />

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Net Salary</Text>
                        <Text style={styles.totalAmount}>{displayTotalAmount}</Text>
                    </View>
                </View>

            </ScrollView>

            <RejectModal
                visible={isNotPaidModalVisible}
                onClose={() => setIsNotPaidModalVisible(false)}
                onConfirm={handleReportNotPaid}
                title="Report Salary Not Paid"
                subtitle="Please enter remarks/comments describing the issue."
                placeholder="Describe the issue (e.g., salary not credited, incorrect amount, etc.)"
                isOperating={submitting}
            />
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
        fontSize: 32,
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
        backgroundColor: theme.colors.greenSurface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 4,
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
    actionBtn: {
        flex: 0,
        width: '100%',
        marginBottom: 12,
    },
    actionBtnDanger: {
        flex: 0,
        width: '100%',
        marginBottom: 16,
    },
});