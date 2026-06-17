import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';
import { useAuthStore } from '../../store/AuthStore';
import CustomInput from '../../components/CustomInput';
import { changePassword } from '../../network/apis';

export default function ChangePassword() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const role = useAuthStore((state) => state.role);
    const empId = useAuthStore((state) => state.empId);
    const userId = useAuthStore((state) => state.userId);
    const username = useAuthStore((state) => state.username);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getHeaderGradient = () => {
        if (role === 'coordinator') return theme.gradients.purple;
        if (role === 'staff') return theme.gradients.green;
        return theme.gradients.blue;
    };

    const getRoleColor = () => {
        if (role === 'coordinator') return theme.colors.purple;
        if (role === 'staff') return theme.colors.successStrong;
        return theme.colors.linkPrimary;
    };

    const getRoleSurfaceColor = () => {
        if (role === 'coordinator') return theme.colors.purpleSurface;
        if (role === 'staff') return theme.colors.greenSurface;
        return theme.colors.blueSurface;
    };

    const handleUpdatePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New password and confirm password do not match.');
            return;
        }

        if (newPassword.length < 8) {
            Alert.alert('Error', 'Password must be at least 8 characters long.');
            return;
        }

        try {
            setIsSubmitting(true);
            const payload = {
                empId: empId || 0,
                userId: userId || 0,
                userName: username,
                password: currentPassword,
                newPassword: newPassword,
                fcmToken: 'string',
            };

            const response = await changePassword(payload);
            if (response && response.success !== false) {
                Alert.alert('Success', 'Password changed successfully.', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            } else {
                Alert.alert('Error', response?.message || 'Failed to change password.');
            }
        } catch (error) {
            console.error('Update password error:', error);
            Alert.alert(
                'Error',
                error.response?.data?.message || error.message || 'An error occurred.'
            );
        } finally {
            setIsSubmitting(false);
            navigation.navigate("Login")
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            <LinearGradient
                colors={getHeaderGradient()}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.headerBg, { paddingTop: insets.top + theme.spacing.md }]}
            >
                <View style={styles.headerTopRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Icon name="chevron-left" size={24} color={theme.colors.white} />
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.headerTitlesContainer}>
                    <Text style={styles.pageTitle}>Change Password</Text>
                    <Text style={styles.pageSubtitle}>Update your account password</Text>
                </View>
            </LinearGradient>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.firstCardGroup}>
                    <View style={styles.whiteCard}>
                        <Text style={styles.inputLabel}>Current Password</Text>
                        <View style={styles.localInputContainer}>
                            <CustomInput
                                placeholder="Enter current password"
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                secureTextEntry={true}
                            />
                        </View>
                    </View>

                    <View style={[styles.whiteCard, { marginTop: 16 }]}>
                        <Text style={styles.inputLabel}>New Password</Text>
                        <View style={styles.localInputContainer}>
                            <CustomInput
                                placeholder="Enter new password"
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry={true}
                            />
                        </View>

                        <View style={{ height: 16 }} />

                        <Text style={styles.inputLabel}>Confirm New Password</Text>
                        <View style={styles.localInputContainer}>
                            <CustomInput
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={true}
                            />
                        </View>
                    </View>
                </View>

                <View style={[styles.reqCard, { backgroundColor: getRoleSurfaceColor() }]}>
                    <Text style={[styles.reqTitle, { color: getRoleColor() }]}>Password Requirements:</Text>
                    {[
                        'At least 8 characters long',
                        'Contains uppercase and lowercase letters',
                        'Contains at least one number',
                        'Contains at least one special character'
                    ].map((req, i) => (
                        <View key={i} style={styles.reqRow}>
                            <View style={[styles.dot, { backgroundColor: getRoleColor() }]} />
                            <Text style={[styles.reqText, { color: getRoleColor() }]}>{req}</Text>
                        </View>
                    ))}
                </View>

                <TouchableOpacity
                    style={[styles.updateBtn, { backgroundColor: getRoleColor() }, isSubmitting && { opacity: 0.7 }]}
                    activeOpacity={0.8}
                    onPress={handleUpdatePassword}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                        <Text style={styles.updateBtnText}>Update Password</Text>
                    )}
                </TouchableOpacity>

                <View style={{ height: 40 }} />
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
        paddingBottom: 40,
    },
    headerTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.sm,
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
    headerTitlesContainer: {
        paddingHorizontal: theme.spacing.lg,
        marginTop: theme.spacing.xs,
    },
    pageTitle: {
        fontSize: 28,
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
        paddingBottom: theme.spacing.xxl,
    },
    scrollView: {
        marginTop: -30,
        zIndex: 5,
        elevation: 5,
    },
    firstCardGroup: {
        marginBottom: 16,
    },
    whiteCard: {
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        padding: 20,
        paddingBottom: 10,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
    },
    inputLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: theme.colors.textHeading,
        marginBottom: 8,
    },
    localInputContainer: {
        marginBottom: -4,
    },
    reqCard: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
    },
    reqTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    reqRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        marginRight: 8,
    },
    reqText: {
        fontSize: 14,
    },
    updateBtn: {
        borderRadius: theme.radius.sm,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    updateBtnText: {
        color: theme.colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
});