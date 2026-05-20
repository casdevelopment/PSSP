import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';

// Adjust the import path based on where you saved your HeroCard component
import HeroCard from '../../components/HeroCard';

const STAFF_DATA = [
    { id: '1', name: 'John Smith', subject: 'Mathematics', email: 'john.smith@school.edu', phone: '+1 555-0101', status: 'Active', joinDate: 'Jan 15, 2020', students: '142' },
    { id: '2', name: 'Emma Wilson', subject: 'Physics', email: 'emma.wilson@school.edu', phone: '+1 555-0102', status: 'Active', joinDate: 'Aug 22, 2019', students: '118' },
    { id: '3', name: 'David Brown', subject: 'English', email: 'david.brown@school.edu', phone: '+1 555-0103', status: 'Active', joinDate: 'Feb 10, 2021', students: '156' },
    { id: '4', name: 'Sarah Lee', subject: 'Chemistry', email: 'sarah.lee@school.edu', phone: '+1 555-0104', status: 'Active', joinDate: 'Nov 05, 2020', students: '94' },
    { id: '5', name: 'Michael Chen', subject: 'Biology', email: 'michael.chen@school.edu', phone: '+1 555-0105', status: 'Active', joinDate: 'Mar 18, 2022', students: '105' },
];

export default function StaffList() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.appBackground} />

            {/* Replaced with Custom HeroCard Component */}
            <View style={{ paddingTop: 16, backgroundColor: theme.colors.appBackground }}>
                <HeroCard
                    topLabel="Total Staff Members"
                    topIcon="users"
                    title={STAFF_DATA.length.toString()}
                    subtitle="All active"
                    colors={theme.gradients.blue}
                /> </View>


            <ScrollView
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Staff List */}
                <View style={styles.listContainer}>
                    {STAFF_DATA.map((staff) => (
                        <TouchableOpacity
                            key={staff.id}
                            style={styles.staffCard}
                            activeOpacity={0.7}
                            onPress={() => navigation.navigate('StaffDetail', { staff })}
                        >
                            <View style={styles.cardHeader}>
                                <Text style={styles.staffName}>{staff.name}</Text>
                                <View style={styles.statusBadge}>
                                    <Text style={styles.statusText}>{staff.status}</Text>
                                </View>
                            </View>

                            <Text style={styles.staffSubject}>{staff.subject}</Text>

                            <View style={styles.contactRow}>
                                <Icon name="mail" size={14} color={theme.colors.textBody} style={styles.contactIcon} />
                                <Text style={styles.contactText}>{staff.email}</Text>
                            </View>
                            <View style={styles.contactRow}>
                                <Icon name="phone" size={14} color={theme.colors.textBody} style={styles.contactIcon} />
                                <Text style={styles.contactText}>{staff.phone}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
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
});