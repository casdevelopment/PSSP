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

export default function AddStudentModal({ visible, onClose }) {
    const insets = useSafeAreaInsets();
    
    // Form states
    const [studentName, setStudentName] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [studentClass, setStudentClass] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = () => {
        // Handle your API call here
        console.log('Submitting Student:', { studentName, rollNumber, studentClass, email, phone });
        
        // Reset form and close
        setStudentName('');
        setRollNumber('');
        setStudentClass('');
        setEmail('');
        setPhone('');
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
                style={styles.modalBg}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Pressable
                    style={styles.modalDismiss}
                    onPress={onClose}
                />

                <View
                    style={[
                        styles.bottomSheet,
                        { paddingBottom: insets.bottom + 20, maxHeight: '90%' },
                    ]}
                >
                    <View style={styles.dragIndicator} />
                    <Text style={styles.modalTitle}>Add New Student</Text>

                    <ScrollView
                        contentContainerStyle={styles.formContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Student Name</Text>
                            <TextInput
                                style={styles.inputBox}
                                placeholder="Enter name"
                                placeholderTextColor={theme.colors.textMuted}
                                value={studentName}
                                onChangeText={setStudentName}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Roll Number</Text>
                            <TextInput
                                style={styles.inputBox}
                                placeholder="Enter roll number"
                                placeholderTextColor={theme.colors.textMuted}
                                value={rollNumber}
                                onChangeText={setRollNumber}
                                keyboardType="default"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Class</Text>
                            <TextInput
                                style={styles.inputBox}
                                placeholder="" 
                                value={studentClass}
                                onChangeText={setStudentClass}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput
                                style={styles.inputBox}
                                placeholder="Enter email"
                                placeholderTextColor={theme.colors.textMuted}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Phone</Text>
                            <TextInput
                                style={styles.inputBox}
                                placeholder="Enter phone"
                                placeholderTextColor={theme.colors.textMuted}
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </ScrollView>

                    <View style={styles.modalActions}>
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
                            <Text style={styles.submitBtnText}>Add Student</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalBg: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-end',
    },
    modalDismiss: {
        flex: 1,
    },
    bottomSheet: {
        backgroundColor: theme.colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 12,
    },
    dragIndicator: {
        width: 40,
        height: 4,
        backgroundColor: '#D1D5DB', // Kept hardcoded as it wasn't an exact match in the theme
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.textHeading,
        marginBottom: 20,
    },
    formContent: {
        paddingBottom: 10,
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.textBody,
        marginBottom: 8,
    },
    inputBox: {
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: theme.colors.textStrong,
        backgroundColor: theme.colors.white,
    },
    modalActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 10,
    },
    cancelBtn: {
        flex: 1,
        backgroundColor: theme.colors.surfaceSubtle,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelBtnText: {
        color: theme.colors.textBody,
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
        color: theme.colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
});