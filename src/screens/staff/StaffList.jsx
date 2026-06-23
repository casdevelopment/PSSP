import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';
import { useAuthStore } from '../../store/AuthStore';
import { getStaffList } from '../../network/apis';

// Adjust the import path based on where you saved your HeroCard component
import HeroCard from '../../components/HeroCard';

export default function StaffList() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const schoolId = useAuthStore((state) => state.schoolId);
    const [staffList, setStaffList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (schoolId) {
            setIsLoading(true);
            getStaffList(schoolId)
                .then((res) => {
                    if (res && res.success) {
                        setStaffList(res.data || []);
                    } else {
                        setStaffList([]);
                    }
                })
                .catch((err) => {
                    console.error('Error fetching staff list:', err);
                    setStaffList([]);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [schoolId]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.appBackground} />

            {/* Replaced with Custom HeroCard Component */}
            <View style={{ paddingTop: 16, backgroundColor: theme.colors.appBackground }}>
                <HeroCard
                    topLabel="Total Staff Members"
                    topIcon="users"
                    title={staffList.length.toString()}
                    subtitle="All active"
                    colors={theme.gradients.blue}
                /> </View>


            <ScrollView
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Staff List */}
                <View style={styles.listContainer}>
                    {isLoading ? (
                        <ActivityIndicator size="large" color={theme.colors.linkPrimary} style={{ marginTop: 40 }} />
                    ) : staffList.length === 0 ? (
                        <View style={styles.centered}>
                            <Icon name="users" size={48} color={theme.colors.textMuted} style={styles.emptyIcon} />
                            <Text style={styles.emptyText}>No staff members found</Text>
                        </View>
                    ) : (
                        staffList.map((staff) => (
                            <TouchableOpacity
                                key={staff.id}
                                style={styles.staffCard}
                                activeOpacity={0.7}
                                onPress={() => navigation.navigate('StaffDetail', { staff })}
                            >
                                <View style={styles.cardHeader}>
                                    <Text style={styles.staffName}>{staff.name || 'Unknown'}</Text>
                                    <View style={styles.statusBadge}>
                                        <Text style={styles.statusText}>Active</Text>
                                    </View>
                                </View>

                                <Text style={styles.staffSubject}>Staff ID: {staff.id}</Text>

                                <View style={styles.contactRow}>
                                    <Icon name="mail" size={14} color={theme.colors.textBody} style={styles.contactIcon} />
                                    <Text style={styles.contactText}>{staff.email || 'N/A'}</Text>
                                </View>
                                <View style={styles.contactRow}>
                                    <Icon name="phone" size={14} color={theme.colors.textBody} style={styles.contactIcon} />
                                    <Text style={styles.contactText}>{staff.phoneNo || 'N/A'}</Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.backgroundLight,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 0,
    },
    listContainer: {
        gap: 12,
    },
    staffCard: {
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    staffName: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.textHeading,
    },
    statusBadge: {
        backgroundColor: theme.colors.successSubtle,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: theme.colors.successStrong,
        fontSize: 13,
        fontWeight: '600',
    },
    staffSubject: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.linkPrimary,
        marginBottom: 12,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    contactIcon: {
        marginRight: 8,
    },
    contactText: {
        fontSize: 14,
        color: theme.colors.textBody,
    },
    centered: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 16,
        color: theme.colors.textMuted,
        fontWeight: '500',
    },
});