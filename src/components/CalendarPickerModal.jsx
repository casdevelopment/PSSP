import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme/theme';

export default function CalendarPickerModal({ visible, onClose, onSelectDate, selectedDate, title }) {
    const today = new Date();
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const renderDays = () => {
        const days = [];
        for (let i = 0; i < firstDayIndex; i++) {
            days.push(<View key={`empty-${i}`} style={styles.calendarDayEmpty} />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isSelected = selectedDate === dateStr;
            const isToday = today.getFullYear() === currentYear && today.getMonth() === currentMonth && today.getDate() === day;

            days.push(
                <TouchableOpacity
                    key={`day-${day}`}
                    style={[
                        styles.calendarDayBtn,
                        isSelected && styles.calendarDaySelected,
                        isToday && !isSelected && styles.calendarDayToday
                    ]}
                    onPress={() => {
                        onSelectDate(dateStr);
                        onClose();
                    }}
                >
                    <Text
                        style={[
                            styles.calendarDayText,
                            isSelected && styles.calendarDayTextSelected,
                            isToday && !isSelected && styles.calendarDayTextToday
                        ]}
                    >
                        {day}
                    </Text>
                </TouchableOpacity>
            );
        }
        return days;
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.calendarOverlay}>
                <View style={styles.calendarContainer}>
                    <View style={styles.calendarHeader}>
                        <Text style={styles.calendarTitle}>{title || 'Select Date'}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.calendarCloseBtn}>
                            <Icon name="x" size={20} color="#0A0A0A" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.monthNavigator}>
                        <TouchableOpacity onPress={handlePrevMonth} style={styles.navArrow}>
                            <Icon name="chevron-left" size={20} color="#4A5565" />
                        </TouchableOpacity>
                        <Text style={styles.monthYearText}>
                            {months[currentMonth]} {currentYear}
                        </Text>
                        <TouchableOpacity onPress={handleNextMonth} style={styles.navArrow}>
                            <Icon name="chevron-right" size={20} color="#4A5565" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.weekDaysContainer}>
                        {weekDays.map((wd) => (
                            <Text key={wd} style={styles.weekDayText}>
                                {wd}
                            </Text>
                        ))}
                    </View>

                    <View style={styles.daysGrid}>
                        {renderDays()}
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    calendarOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    calendarContainer: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        width: '100%',
        maxWidth: 360,
        padding: 16,
        ...theme.shadow.card,
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    calendarTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0A0A0A',
    },
    calendarCloseBtn: {
        padding: 4,
    },
    monthNavigator: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    navArrow: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
    },
    monthYearText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0A0A0A',
    },
    weekDaysContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    weekDayText: {
        width: 38,
        textAlign: 'center',
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    calendarDayBtn: {
        width: 38,
        height: 38,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
        borderRadius: 19,
    },
    calendarDayEmpty: {
        width: 38,
        height: 38,
        marginBottom: 6,
    },
    calendarDaySelected: {
        backgroundColor: theme.colors.linkPrimary,
    },
    calendarDayToday: {
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: theme.colors.linkPrimary,
    },
    calendarDayText: {
        fontSize: 14,
        color: '#0A0A0A',
    },
    calendarDayTextSelected: {
        color: '#FFF',
        fontWeight: '600',
    },
    calendarDayTextToday: {
        color: theme.colors.linkPrimary,
        fontWeight: '600',
    },
});
