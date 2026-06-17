import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme/theme';
import { useAuthStore } from '../store/AuthStore';
import { getEmpLeaveBalanceList, applyLeave } from '../network/apis';
import CalendarPickerModal from './CalendarPickerModal';

export default function RequestLeaveModel({ visible, onClose }) {
    const insets = useSafeAreaInsets();


    const userId = useAuthStore((state) => state.userId);
    const empId = useAuthStore((state) => state.empId);
    const schoolId = useAuthStore((state) => state.schoolId);

    const [balances, setBalances] = useState([]);
    const [selectedBalance, setSelectedBalance] = useState(null);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [reason, setReason] = useState('');
    const [isLoadingBalances, setIsLoadingBalances] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showTypePicker, setShowTypePicker] = useState(false);
    const [showFromDatePicker, setShowFromDatePicker] = useState(false);
    const [showToDatePicker, setShowToDatePicker] = useState(false);



    const handleClose = () => {
        setSelectedBalance(null);
        setFromDate('');
        setToDate('');
        setReason('');
        setShowTypePicker(false);
        setShowFromDatePicker(false);
        setShowToDatePicker(false);
        onClose();
    };

    const handleSubmit = async () => {
        if (!selectedBalance || !fromDate || !toDate) {
            Alert.alert('Error', 'Please select a leave type and dates');
            return;
        }
        setIsSubmitting(true);
        try {
            const fromDateIso = fromDate + 'T00:00:00.000Z';
            const toDateIso = toDate + 'T23:59:59.000Z';

            const activeLeaveTypeId = selectedBalance.leaveTypeId 
                || selectedBalance.entityLeaveTypeId 
                || selectedBalance.leaveTypeID 
                || selectedBalance.entityLeaveTypeID 
                || selectedBalance.empLeaveBalanceID 
                || 0;

            const payload = {
                userId: userId || 0,
                empId: empId || 0,
                leaveTypeId: activeLeaveTypeId,
                fromDate: fromDateIso,
                toDate: toDateIso,
                reason: reason || '',
                schoolId: schoolId || 0
            };

            const res = await applyLeave(payload);
            if (res && res.success !== false) {
                Alert.alert('Success', 'Leave requested successfully');
                handleClose();
            } else {
                Alert.alert('Error', res?.message || 'Failed to submit leave request');
            }
        } catch (error) {
            console.error('Submit leave error:', error);
            const errorMsg = error.response?.data?.message 
                || error.message 
                || 'Failed to submit leave request';
            const details = `\nDebug Info: leaveTypeId=${selectedBalance?.leaveTypeId || 'undefined'}, entityLeaveTypeId=${selectedBalance?.entityLeaveTypeId || 'undefined'}, empLeaveBalanceID=${selectedBalance?.empLeaveBalanceID || 'undefined'}`;
            Alert.alert('Error', errorMsg + details);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (visible && empId) {
            const fetchBalances = async () => {
                setIsLoadingBalances(true);
                try {
                    const res = await getEmpLeaveBalanceList(empId);
                    setBalances(res?.data || []);
                } catch (error) {
                    console.error('Fetch balances error:', error);
                    setBalances([]);
                } finally {
                    setIsLoadingBalances(false);
                }
            };
            fetchBalances();
        }
    }, [visible, empId]);

    return (
        <>
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                onRequestClose={handleClose}
            >
                <KeyboardAvoidingView
                    style={styles.modelBg}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <Pressable
                        style={styles.modelDismiss}
                        onPress={handleClose}
                    />

                    <View
                        style={[
                            styles.bottomSheet,
                            { paddingBottom: insets.bottom + 20 },
                        ]}
                    >
                        <View style={styles.dragIndicator} />
                        <Text style={styles.modelTitle}>Request Leave</Text>

                        <ScrollView
                            contentContainerStyle={styles.formContent}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Leave Type</Text>
                                <TouchableOpacity
                                    style={styles.inputBox}
                                    onPress={() => setShowTypePicker(!showTypePicker)}
                                >
                                    <View style={styles.dropdownHeader}>
                                        <Text style={[styles.dropdownSelectedText, !selectedBalance && styles.placeholderText]}>
                                            {selectedBalance ? `${selectedBalance.leaveTypeName} (Bal: ${selectedBalance.balance})` : 'Select Leave Type'}
                                        </Text>
                                        <Icon name={showTypePicker ? 'chevron-up' : 'chevron-down'} size={20} color="#6A7282" />
                                    </View>
                                </TouchableOpacity>

                                {showTypePicker && (
                                    <View style={styles.dropdownList}>
                                        {isLoadingBalances ? (
                                            <ActivityIndicator size="small" color={theme.colors.purple} style={{ padding: 10 }} />
                                        ) : balances.length === 0 ? (
                                            <Text style={styles.dropdownNoData}>No leave types available</Text>
                                        ) : (
                                            balances.map((item, index) => (
                                                <TouchableOpacity
                                                    key={item.empLeaveBalanceID || item.leaveTypeId || String(index)}
                                                    style={styles.dropdownItem}
                                                    onPress={() => {
                                                        setSelectedBalance(item);
                                                        setShowTypePicker(false);
                                                    }}
                                                >
                                                    <Text style={styles.dropdownItemText}>{item.leaveTypeName}</Text>
                                                    <Text style={styles.dropdownItemBal}>Bal: {item.balance}</Text>
                                                </TouchableOpacity>
                                            ))
                                        )}
                                    </View>
                                )}
                            </View>

                            <View style={styles.rowInputs}>
                                <TouchableOpacity
                                    style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}
                                    onPress={() => setShowFromDatePicker(true)}
                                >
                                    <Text style={styles.inputLabel}>From Date</Text>
                                    <View style={[styles.inputBox, styles.dateInputInner]}>
                                        <Text style={[styles.dateInputText, !fromDate && styles.placeholderText]}>
                                            {fromDate ? fromDate : 'YYYY-MM-DD'}
                                        </Text>
                                        <Icon name="calendar" size={18} color="#6A7282" />
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}
                                    onPress={() => setShowToDatePicker(true)}
                                >
                                    <Text style={styles.inputLabel}>To Date</Text>
                                    <View style={[styles.inputBox, styles.dateInputInner]}>
                                        <Text style={[styles.dateInputText, !toDate && styles.placeholderText]}>
                                            {toDate ? toDate : 'YYYY-MM-DD'}
                                        </Text>
                                        <Icon name="calendar" size={18} color="#6A7282" />
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Reason</Text>
                                <TextInput
                                    style={[styles.inputBox, styles.textArea]}
                                    placeholder="Enter reason for leave"
                                    placeholderTextColor={theme.colors.textMuted || '#9CA3AF'}
                                    value={reason}
                                    onChangeText={setReason}
                                    multiline
                                    textAlignVertical="top"
                                />
                            </View>
                        </ScrollView>

                        <View style={styles.modelActions}>
                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={handleClose}
                            >
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]}
                                onPress={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <Text style={styles.submitBtnText}>Submit Request</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            <CalendarPickerModal
                visible={showFromDatePicker}
                onClose={() => setShowFromDatePicker(false)}
                onSelectDate={(date) => setFromDate(date)}
                selectedDate={fromDate}
                title="Select From Date"
            />

            <CalendarPickerModal
                visible={showToDatePicker}
                onClose={() => setShowToDatePicker(false)}
                onSelectDate={(date) => setToDate(date)}
                selectedDate={toDate}
                title="Select To Date"
            />
        </>
    );
}

const styles = StyleSheet.create({
    modelBg: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-end',
    },
    modelDismiss: {
        flex: 1,
    },
    bottomSheet: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 12,
    },
    dragIndicator: {
        width: 40,
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    modelTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#0A0A0A',
        marginBottom: 24,
    },
    formContent: {
        paddingBottom: 20,
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4A5565',
        marginBottom: 8,
    },
    inputBox: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#0A0A0A',
        backgroundColor: '#FFF',
    },
    rowInputs: {
        flexDirection: 'row',
    },
    textArea: {
        height: 120,
        paddingTop: 16,
    },
    modelActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 8,
    },
    cancelBtn: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelBtnText: {
        color: '#0A0A0A',
        fontSize: 16,
        fontWeight: '600',
    },
    submitBtn: {
        flex: 1,
        backgroundColor: theme.colors.linkPrimary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    submitBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    dropdownHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownSelectedText: {
        fontSize: 16,
        color: '#0A0A0A',
    },
    placeholderText: {
        color: '#9CA3AF',
    },
    dropdownList: {
        marginTop: 4,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        backgroundColor: '#FFF',
        overflow: 'hidden',
        maxHeight: 200,
    },
    dropdownItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    dropdownItemText: {
        fontSize: 15,
        color: '#0A0A0A',
    },
    dropdownItemBal: {
        fontSize: 14,
        color: '#6B7280',
    },
    dropdownNoData: {
        padding: 16,
        textAlign: 'center',
        color: '#9CA3AF',
        fontSize: 15,
    },

    dateInputInner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateInputText: {
        fontSize: 16,
        color: '#0A0A0A',
    },
});