import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';
import { useAuthStore } from '../../store/AuthStore';

const ProfileInput = ({ label, value, onChangeText }) => (
    <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>{label}</Text>
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.textInput}
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor={theme.colors.textMuted}
            />
        </View>
    </View>
);

export default function EditProfile() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const role = useAuthStore((state) => state.role);

    const [name, setName] = useState('Sarah Johnson');
    const [email, setEmail] = useState('sarah.johnson@greenwood.edu');
    const [phone, setPhone] = useState('+1 (555) 234-5678');
    const [school, setSchool] = useState('Greenwood High School');
    const [position, setPosition] = useState('Principal');

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
                    <Text style={styles.pageTitle}>Edit Profile</Text>
                    <Text style={styles.pageSubtitle}>Update your personal information</Text>
                </View>
            </LinearGradient>

            <View style={styles.avatarCard}>
                <View style={[styles.avatarCircle, { backgroundColor: getRoleSurfaceColor() }]}>
                    <Icon name="user" size={40} color={getRoleColor()} />
                </View>
            </View>

            <ScrollView
                style={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <ProfileInput label="Full Name" value={name} onChangeText={setName} />
                <ProfileInput label="Email Address" value={email} onChangeText={setEmail} />
                <ProfileInput label="Phone Number" value={phone} onChangeText={setPhone} />
                <ProfileInput label="School" value={school} onChangeText={setSchool} />
                <ProfileInput label="Position" value={position} onChangeText={setPosition} />

                <TouchableOpacity style={[styles.saveBtn, { backgroundColor: getRoleColor() }]} activeOpacity={0.8}>
                    <Text style={styles.saveBtnText}>Save Changes</Text>
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
        paddingHorizontal: theme.spacing.md,
        paddingBottom: theme.spacing.xxl,
    },
    avatarCard: {
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        padding: 24,
        marginHorizontal: 16,
        marginTop: -30,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputWrapper: {
        backgroundColor: theme.colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.textBody,
        marginBottom: 8,
        marginLeft: 4,
    },
    inputContainer: {
        backgroundColor: theme.colors.white,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
        height: 54,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: theme.colors.textStrong,
    },
    saveBtn: {
        paddingVertical: 16,
        borderRadius: theme.radius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
    },
    saveBtnText: {
        color: theme.colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
});