import React, { useState } from 'react';
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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';

export default function RequestLeaveModel({ visible, onClose }) {
    const insets = useSafeAreaInsets();
    
    // Form states
    const [leaveType, setLeaveType] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [reason, setReason] = useState('');

    const handleSubmit = () => {
        // Handle your API call here
        console.log('Submitting Leave:', { leaveType, fromDate, toDate, reason });
        
        // Reset form and close
        setLeaveType('');
        setFromDate('');
        setToDate('');
        setReason('');
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={styles.modelBg}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Pressable
                    style={styles.modelDismiss}
                    onPress={onClose}
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
                            <TextInput
                                style={styles.inputBox}
                                placeholder="e.g. Sick, Casual"
                                value={leaveType}
                                onChangeText={setLeaveType}
                            />
                        </View>

                        <View style={styles.rowInputs}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                                <Text style={styles.inputLabel}>From Date</Text>
                                <TextInput
                                    style={styles.inputBox}
                                    placeholder="YYYY-MM-DD"
                                    value={fromDate}
                                    onChangeText={setFromDate}
                                />
                            </View>

                            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                                <Text style={styles.inputLabel}>To Date</Text>
                                <TextInput
                                    style={styles.inputBox}
                                    placeholder="YYYY-MM-DD"
                                    value={toDate}
                                    onChangeText={setToDate}
                                />
                            </View>
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
                            onPress={onClose}
                        >
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.submitBtn}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.submitBtnText}>Submit Request</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
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
});