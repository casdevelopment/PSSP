import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme/theme';
import CustomInput from './CustomInput';
import PrimaryButton from './PrimaryButton';
import { forgotPassword } from '../network/apis';

export default function ForgotPasswordModel({ visible, onClose }) {
    const [mobileNo, setMobileNo] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        const trimmedMobile = mobileNo.trim();
        if (!trimmedMobile) {
            Alert.alert('Error', 'Please enter your mobile number.');
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await forgotPassword({ mobileNo: trimmedMobile });
            if (response && response.success !== false) {
                Alert.alert(
                    'Success',
                    response?.message || 'Instructions to reset your password have been sent to your mobile number.',
                    [{ text: 'OK', onPress: () => {
                        setMobileNo('');
                        onClose();
                    }}]
                );
            } else {
                Alert.alert('Error', response?.message || 'Failed to process forgot password request.');
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            Alert.alert(
                'Error',
                error.response?.data?.message || error.message || 'An error occurred. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Forgot Password</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn} disabled={isSubmitting}>
                            <Icon name="x" size={20} color={theme.colors.textHeading} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.description}>
                        Enter your registered mobile number below to retrieve or reset your password.
                    </Text>

                    <CustomInput
                        label="Mobile Number"
                        iconName="phone"
                        placeholder="923001234567"
                        keyboardType="phone-pad"
                        value={mobileNo}
                        onChangeText={setMobileNo}
                        editable={!isSubmitting}
                    />

                    <PrimaryButton
                        title="Submit"
                        onPress={handleSubmit}
                        loading={isSubmitting}
                        showChevron={false}
                        style={styles.submitBtn}
                    />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        backgroundColor: theme.colors.white,
        borderRadius: 20,
        width: '100%',
        maxWidth: 360,
        padding: 24,
        ...theme.shadow.card,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.textHeading,
    },
    closeBtn: {
        padding: 4,
    },
    description: {
        fontSize: 14,
        color: theme.colors.textBody,
        marginBottom: 20,
        lineHeight: 20,
    },
    submitBtn: {
        marginTop: 8,
        width: '100%',
    },
});
