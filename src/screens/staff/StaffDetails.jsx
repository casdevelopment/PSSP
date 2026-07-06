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
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';
import { getEmployeeDetailsWithStudentCount } from '../../network/apis';

export default function StaffDetail() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();

    // Retrieve data passed from the list, with fallbacks
    const staff = route.params?.staff || {
        id: 2,
        name: 'John Smith',
        email: 'john.smith@school.edu',
        phoneNo: '+1 555-0101',
        status: 'Active',
        joinDate: 'Jan 15, 2020',
        students: '142'
    };

    const [details, setDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const employeeId = staff.id;
        if (employeeId) {
            setIsLoading(true);
            getEmployeeDetailsWithStudentCount(employeeId)
                .then((res) => {
                    if (res && res.success) {
                        setDetails(res.data || []);
                    } else {
                        setDetails([]);
                    }
                })
                .catch((err) => {
                    console.error('Error fetching employee details:', err);
                    setDetails([]);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [staff.id]);

    const firstRecord = details[0] || {};
    const name = firstRecord.name || staff.name || 'Unknown';
    const email = firstRecord.email || staff.email || 'N/A';
    const phone = firstRecord.phoneNo || staff.phoneNo || 'N/A';
    const rawJoinDate = firstRecord.joiningDate || staff.joinDate;
    const joinDate = rawJoinDate
        ? new Date(rawJoinDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'N/A';
    const students = firstRecord.totalStudents !== undefined ? String(firstRecord.totalStudents) : (staff.students || '0');

    const classes = details.map((item) => {
        const grade = item.gradeName || 'Unknown Grade';
        const section = item.sectionName ? ` - ${item.sectionName}` : '';
        return `${grade}${section}`;
    });

    const RECENT_ACTIVITY = [
        { id: '1', title: `Marked attendance for ${classes[0] || 'assigned class'}`, time: '2 hours ago' },
        { id: '2', title: `Conducted class`, time: '4 hours ago' },
        { id: '3', title: 'Salary received for April', time: '2 days ago' },
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.linkPrimary} />

            {/* Header Background (Extended for overlap) */}
            <View style={[styles.headerBg, { paddingTop: insets.top }]}>
                <View style={styles.headerTopRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Icon name="chevron-left" size={24} color={theme.colors.white} />
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.headerTitles}>
                    <Text style={styles.staffName}>{name}</Text>
                    <Text style={styles.staffSubjectHeader}>Staff ID: {staff.id}</Text>
                </View>
            </View>

            {/* Floating Overlap Card */}
            <View style={[styles.floatingCard, theme.shadow.card]}>
                <View style={styles.floatCol}>
                    <Text style={styles.floatLabel}>Status</Text>
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>Active</Text>
                    </View>
                </View>
                <View style={[styles.floatCol, { alignItems: 'flex-end' }]}>
                    <Text style={styles.floatLabel}>Joining Date</Text>
                    <Text style={styles.joinDateText}>{joinDate}</Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {isLoading ? (
                    <View style={styles.centered}>
                        <ActivityIndicator size="large" color={theme.colors.linkPrimary} />
                    </View>
                ) : (
                    <>
                        {/* Contact Information */}
                        <View style={styles.sectionCard}>
                            <Text style={styles.sectionTitle}>Contact Information</Text>

                            <View style={[styles.infoRow, { backgroundColor: theme.colors.appBackground }]}>
                                <View style={[styles.iconCircle, { backgroundColor: theme.colors.blueSurface }]}>
                                    <Icon name="mail" size={18} color={theme.colors.linkPrimary} />
                                </View>
                                <View>
                                    <Text style={styles.infoLabel}>Email</Text>
                                    <Text style={styles.infoValue}>{email}</Text>
                                </View>
                            </View>

                            <View style={[styles.infoRow, { backgroundColor: theme.colors.appBackground }]}>
                                <View style={[styles.iconCircle, { backgroundColor: theme.colors.greenSurface }]}>
                                    <Icon name="phone" size={18} color={theme.colors.successStrong} />
                                </View>
                                <View>
                                    <Text style={styles.infoLabel}>Phone</Text>
                                    <Text style={styles.infoValue}>{phone}</Text>
                                </View>
                            </View>

                            <View style={[styles.infoRow, { backgroundColor: theme.colors.appBackground, marginBottom: 0 }]}>
                                <View style={[styles.iconCircle, { backgroundColor: theme.colors.purpleSurface }]}>
                                    <Icon name="info" size={18} color={theme.colors.accentPurple} />
                                </View>
                                <View>
                                    <Text style={styles.infoLabel}>Employee ID</Text>
                                    <Text style={styles.infoValue}>{staff.id}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Performance Stats */}
                        <View style={styles.sectionCard}>
                            <Text style={styles.sectionTitleOutside}>Performance</Text>
                            <View style={styles.statsRow}>
                                <View style={[styles.statCard, { backgroundColor: theme.colors.blueSurface }]}>
                                    <View style={styles.statHeader}>
                                        <Icon name="calendar" size={16} color={theme.colors.linkPrimary} />
                                        <Text style={[styles.statLabel, { color: theme.colors.linkPrimary }]}>Attendance</Text>
                                    </View>
                                    <Text style={[styles.statValue, { color: theme.colors.linkPrimary }]}>98%</Text>
                                </View>

                                <View style={[styles.statCard, { backgroundColor: theme.colors.purpleSurface }]}>
                                    <View style={styles.statHeader}>
                                        <Icon name="award" size={16} color={theme.colors.accentPurple} />
                                        <Text style={[styles.statLabel, { color: theme.colors.accentPurple }]}>Performance</Text>
                                    </View>
                                    <Text style={[styles.statValue, { color: theme.colors.accentPurple }]}>95%</Text>
                                </View>
                            </View>
                        </View>

                        {/* Assigned Classes */}
                        <View style={styles.sectionCard}>
                            <Text style={styles.sectionTitle}>Assigned Classes</Text>
                            {classes.length === 0 ? (
                                <View style={styles.classPill}>
                                    <Text style={styles.classPillText}>No assigned classes</Text>
                                </View>
                            ) : (
                                classes.map((className, index) => (
                                    <View key={index} style={styles.classPill}>
                                        <Text style={styles.classPillText}>{className}</Text>
                                    </View>
                                ))
                            )}

                            <View style={styles.totalStudentsRow}>
                                <Text style={styles.totalStudentsLabel}>Total Students</Text>
                                <Text style={styles.totalStudentsValue}>{students}</Text>
                            </View>
                        </View>

                        {/* Recent Activity */}
                        {/* <View style={styles.sectionCard}>
                            <Text style={styles.sectionTitle}>Recent Activity</Text>
                            {RECENT_ACTIVITY.map((activity, index) => (
                                <View
                                    key={activity.id}
                                    style={[
                                        styles.activityRow,
                                        index === RECENT_ACTIVITY.length - 1 && { borderBottomWidth: 0, paddingBottom: 0 }
                                    ]}
                                >
                                    <View style={styles.activityIconCircle}>
                                        <Icon name="trending-up" size={16} color={theme.colors.successStrong} />
                                    </View>
                                    <View style={styles.activityDetails}>
                                        <Text style={styles.activityTitle}>{activity.title}</Text>
                                        <Text style={styles.activityTime}>{activity.time}</Text>
                                    </View>
                                </View>
                            ))}
                        </View> */}
                    </>
                )}
            </ScrollView>

            {/* Bottom Action Bar */}
            {/* <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                <TouchableOpacity style={styles.primaryBtn}>
                    <Text style={styles.primaryBtnText}>Edit Details</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryBtn}>
                    <Text style={styles.secondaryBtnText}>View Timetable</Text>
                </TouchableOpacity>
            </View> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.backgroundLight,
    },
    headerBg: {
        backgroundColor: theme.colors.linkPrimary,
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
    staffName: {
        fontSize: 26,
        fontWeight: '800',
        color: theme.colors.white,
        marginBottom: 4,
    },
    staffSubjectHeader: {
        fontSize: 15,
        color: theme.colors.white80,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 40,
        marginTop: -10,
    },
    floatingCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        padding: 20,
        marginTop: -30,
        marginHorizontal: 16,
        marginBottom: 10,
    },
    floatCol: {
        justifyContent: 'center',
    },
    floatLabel: {
        fontSize: 13,
        color: theme.colors.textMuted,
        marginBottom: 8,
    },
    statusBadge: {
        backgroundColor: theme.colors.successSubtle,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    statusText: {
        color: theme.colors.successStrong,
        fontSize: 14,
        fontWeight: '700',
    },
    joinDateText: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.textHeading,
    },
    sectionCard: {
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.textHeading,
        marginBottom: 16,
    },
    sectionTitleOutside: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.textHeading,
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    infoLabel: {
        fontSize: 12,
        color: theme.colors.textMuted,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 15,
        fontWeight: '600',
        color: theme.colors.textHeading,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 3,
        gap: 12,
    },
    statCard: {
        flex: 1,
        borderRadius: 16,
        padding: 12,
    },
    statHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
    },
    statValue: {
        fontSize: 26,
        fontWeight: '800',
    },
    classPill: {
        backgroundColor: theme.colors.blueSurface,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 10,
    },
    classPillText: {
        color: theme.colors.linkPrimary,
        fontSize: 15,
        fontWeight: '600',
    },
    totalStudentsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: theme.colors.surfaceSubtle,
    },
    totalStudentsLabel: {
        fontSize: 15,
        color: theme.colors.textMuted,
    },
    totalStudentsValue: {
        fontSize: 18,
        fontWeight: '800',
        color: theme.colors.linkPrimary,
    },
    activityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.surfaceSubtle,
    },
    activityIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.white,
        borderWidth: 1,
        borderColor: theme.colors.surfaceSubtle,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    activityDetails: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: theme.colors.textHeading,
        marginBottom: 4,
    },
    activityTime: {
        fontSize: 13,
        color: theme.colors.textMuted,
    },
    bottomBar: {
        flexDirection: 'row',
        backgroundColor: theme.colors.white,
        paddingHorizontal: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: theme.colors.borderSubtle,
        gap: 12,
    },
    primaryBtn: {
        flex: 1,
        backgroundColor: theme.colors.linkPrimary,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    primaryBtnText: {
        color: theme.colors.white,
        fontSize: 15,
        fontWeight: '600',
    },
    secondaryBtn: {
        flex: 1,
        backgroundColor: theme.colors.white,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    secondaryBtnText: {
        color: theme.colors.textBody,
        fontSize: 15,
        fontWeight: '600',
    },
    centered: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
});