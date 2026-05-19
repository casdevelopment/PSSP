import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme/theme';
import LeaveRequestCard from '../../components/LeaveRequestCard';
import { useAuthStore } from '../../store/AuthStore';

export const LEAVE_REQUESTS = [
    {
        id: '1',
        type: 'Sick Leave',
        status: 'Pending',
        appliedDate: 'Apr 28, 2026',
        duration: '2 days',
        period: 'May 1 - May 2',
    },
    {
        id: '2',
        type: 'Casual Leave',
        status: 'Approved',
        appliedDate: 'Apr 18, 2026',
        duration: '1 day',
        period: 'Apr 20 - Apr 20',
    },
    {
        id: '3',
        type: 'Personal Leave',
        status: 'Approved',
        appliedDate: 'Apr 1, 2026',
        duration: '3 days',
        period: 'Apr 5 - Apr 7',
    },
];

const ProgressBar = ({ label, used, total, color }) => {
    const percentage = (used / total) * 100;

    return (
        <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>{label}</Text>
                <Text style={styles.progressValue}>
                    {used}/{total} used
                </Text>
            </View>
            <View style={styles.progressTrack}>
                <View
                    style={[
                        styles.progressFill,
                        { width: `${percentage}%`, backgroundColor: color },
                    ]}
                />
            </View>
        </View>
    );
};

export default function LeaveRequests() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const user = useAuthStore((state) => state.user);
    const role = user?.role;

    // Form states
    const [leaveType, setLeaveType] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [reason, setReason] = useState('');

    

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-left" size={24} color={theme.colors.textHeading} />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Leave Requests</Text>
                {(role === 'principal' || role === 'staff') && (
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setModalVisible(true)}
                    >
                        <Icon name="plus" size={24} color="#FFF" />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Main Balance Hero */}
                <LinearGradient
                    colors={theme.gradients.blue}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.heroCard, theme.shadow.hero]}
                >
                    <View style={styles.heroTop}>
                        <Icon
                            name="calendar"
                            size={20}
                            color="#FFF"
                            style={styles.heroIcon}
                        />
                        {role === 'principal' || role === 'coordinator' ? (
                            <Text style={styles.heroLabel}>Pending Requests</Text>
                        ) : (
                            <Text style={styles.heroLabel}>Leave Balance</Text>
                        )}
                    </View>

                    <Text style={styles.heroValue}>2</Text>
                    {role === 'principal' || role === 'coordinator' ? (
                        <Text style={styles.heroSubText}>Days remaining</Text>
                    ) : (<Text style={styles.heroSubText}>Re</Text>
                    )}
                </LinearGradient>

                {role === 'staff' && (
                    <View style={styles.sectionCard}>
                        <Text style={styles.sectionTitle}>Pending Requests</Text>
                        <ProgressBar
                            label="Sick Leave"
                            used={2}
                            total={10}
                            color={theme.colors.linkPrimary}
                        />

                        <View style={styles.divider} />

                        <ProgressBar
                            label="Casual Leave"
                            used={4}
                            total={12}
                            color="#10B981"
                        />

                        <View style={styles.divider} />

                        <ProgressBar
                            label="Personal Leave"
                            used={3}
                            total={8}
                            color="#8B5CF6"
                        />
                    </View>
                )}
                {role === 'staff' && (
                    <Text style={styles.listTitle}>My Requests</Text>
                )}

                {/* Requests List */}
                <View style={styles.listContainer}>
                    {LEAVE_REQUESTS.map((request) => (
                        <LeaveRequestCard
                            key={request.id}
                            request={request}
                            onPress={() => navigation.navigate('LeaveDetail', { id: request.id })}
                        />
                    ))}
                </View>
            </ScrollView>

            {/* Request Leave Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    style={styles.modalBg}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <Pressable
                        style={styles.modalDismiss}
                        onPress={() => setModalVisible(false)}
                    />

                    <View
                        style={[
                            styles.bottomSheet,
                            { paddingBottom: insets.bottom + 20 },
                        ]}
                    >
                        <View style={styles.dragIndicator} />
                        <Text style={styles.modalTitle}>Request Leave</Text>

                        <ScrollView
                            contentContainerStyle={styles.formContent}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Leave Type</Text>
                                <TextInput
                                    style={styles.inputBox}
                                    placeholder=""
                                    value={leaveType}
                                    onChangeText={setLeaveType}
                                />
                            </View>

                            <View style={styles.rowInputs}>
                                <View
                                    style={[
                                        styles.inputGroup,
                                        { flex: 1, marginRight: 8 },
                                    ]}
                                >
                                    <Text style={styles.inputLabel}>From Date</Text>
                                    <TextInput
                                        style={styles.inputBox}
                                        placeholder=""
                                        value={fromDate}
                                        onChangeText={setFromDate}
                                    />
                                </View>

                                <View
                                    style={[
                                        styles.inputGroup,
                                        { flex: 1, marginLeft: 8 },
                                    ]}
                                >
                                    <Text style={styles.inputLabel}>To Date</Text>
                                    <TextInput
                                        style={styles.inputBox}
                                        placeholder=""
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
                                    placeholderTextColor={theme.colors.textMuted}
                                    value={reason}
                                    onChangeText={setReason}
                                    multiline
                                    textAlignVertical="top"
                                />
                            </View>
                        </ScrollView>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.submitBtn}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.submitBtnText}>
                                    Submit Request
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    backButton: {
        paddingRight: 10,
        display: 'none',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#0A0A0A',
        flex: 1,
    },
    addButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: theme.colors.linkPrimary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    heroCard: {
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
    },
    heroTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    heroIcon: {
        marginRight: 8,
    },
    heroLabel: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 16,
        fontWeight: '500',
    },
    heroValue: {
        color: '#FFF',
        fontSize: 48,
        fontWeight: '800',
        marginBottom: 4,
    },
    heroSubText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
    },
    sectionCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0A0A0A',
        marginBottom: 20,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 16,
    },
    progressContainer: {
        width: '100%',
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    progressLabel: {
        fontSize: 15,
        color: theme.colors.textBody,
    },
    progressValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#0A0A0A',
    },
    progressTrack: {
        height: 8,
        backgroundColor: '#F3F4F6',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    listTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0A0A0A',
        marginBottom: 16,
    },
    listContainer: {
        gap: 12,
    },
    
    modalBg: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-end',
    },
    modalDismiss: {
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
    modalTitle: {
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
    modalActions: {
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