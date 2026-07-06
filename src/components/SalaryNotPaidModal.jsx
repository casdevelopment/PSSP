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
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import { saveSalaryNotAcknowledgement } from '../network/apis';

export default function SalaryNotPaidModal({ visible, onClose, empId, registerId, onSuccess }) {
    const insets = useSafeAreaInsets();
    const [remarks, setRemarks] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClose = () => {
        setRemarks('');
        onClose();
    };

    const handleSubmit = async () => {
        if (!remarks.trim()) {
            Alert.alert('Validation Error', 'Please enter comments/remarks before submitting.');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                empId: Number(empId) || 0,
                registerId: Number(registerId) || 0,
                remarks: remarks.trim(),
            };

            const res = await saveSalaryNotAcknowledgement(payload);
            if (res && res.success) {
                Alert.alert('Success', 'Remarks submitted successfully.', [
                    {
                        text: 'OK',
                        onPress: () => {
                            if (onSuccess) onSuccess();
                            handleClose();
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
            setIsSubmitting(false);
        }
    };

    return (
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
                        { paddingBottom: insets.bottom + 20, maxHeight: '90%' },
                    ]}
                >
                    <View style={styles.dragIndicator} />
                    <Text style={styles.modelTitle}>Report Salary Not Paid</Text>

                    <ScrollView
                        contentContainerStyle={styles.formContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Remarks / Comments</Text>
                            <TextInput
                                style={[styles.inputBox, styles.textArea]}
                                placeholder="Describe the issue (e.g., salary not credited, incorrect amount, etc.)"
                                placeholderTextColor={theme.colors.textMuted || '#9CA3AF'}
                                value={remarks}
                                onChangeText={setRemarks}
                                multiline
                                textAlignVertical="top"
                            />
                        </View>
                    </ScrollView>

                    <View style={styles.modelActions}>
                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={handleClose}
                            disabled={isSubmitting}
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
                                <Text style={styles.submitBtnText}>Submit Remarks</Text>
                            )}
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
        marginBottom: 20,
    },
    formContent: {
        paddingBottom: 20,
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
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
    textArea: {
        height: 120,
        paddingTop: 14,
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
        backgroundColor: theme.colors.dangerStrong || '#DC2626',
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
