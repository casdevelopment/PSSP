import React, { useState, useEffect } from 'react';
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
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme/theme';
import { useAuthStore } from '../store/AuthStore';
import { getAccountHeadList, saveExpenseList } from '../network/apis';
import CalendarPickerModal from './CalendarPickerModal';

export default function AddExpenseModel({ visible, onClose, onSuccess }) {
    const insets = useSafeAreaInsets();

    // Auth state details
    const userId = useAuthStore((state) => state.userId);
    const schoolId = useAuthStore((state) => state.schoolId);

    // Form states
    const [categories, setCategories] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [searchText, setSearchText] = useState('');

    // UI visibility controls
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch account heads (expense categories) when modal opens
    useEffect(() => {
        if (visible) {
            // Set default date to today
            const today = new Date();
            const y = today.getFullYear();
            const m = String(today.getMonth() + 1).padStart(2, '0');
            const d = String(today.getDate()).padStart(2, '0');
            setSelectedDate(`${y}-${m}-${d}`);

            setIsLoadingCategories(true);
            getAccountHeadList("expense")
                .then((res) => {
                    if (res && res.success) {
                        setCategories(res.data || []);
                        console.log('Account heads:', res.data);
                    } else {
                        setCategories([]);
                    }
                })
                .catch((err) => {
                    console.error('Error fetching account heads:', err);
                    setCategories([]);
                })
                .finally(() => {
                    setIsLoadingCategories(false);
                });
        }
    }, [visible]);

    const handleClose = () => {
        // Reset states
        setSelectedCategory(null);
        setAmount('');
        setDescription('');
        setSelectedDate('');
        setShowCategoryPicker(false);
        setShowDatePicker(false);
        setSearchText('');
        onClose();
    };

    const handleSubmit = async () => {
        if (!selectedCategory) {
            Alert.alert('Validation Error', 'Please select an expense category.');
            return;
        }
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            Alert.alert('Validation Error', 'Please enter a valid amount greater than 0.');
            return;
        }
        if (!description.trim()) {
            Alert.alert('Validation Error', 'Please enter a description for the expense.');
            return;
        }
        if (!selectedDate) {
            Alert.alert('Validation Error', 'Please select a date.');
            return;
        }

        setIsSubmitting(true);
        try {
            // Format selectedDate into ISO string
            const formattedDate = new Date(selectedDate).toISOString();

            const payload = {
                expId: 0,
                schoolId: Number(schoolId) || 0,
                userId: Number(userId) || 0,
                expenses: [
                    {
                        expName: selectedCategory.descE,
                        glAccountNo: selectedCategory.account_ID,
                        expDesc: description.trim(),
                        amount: Number(amount),
                        expDate: formattedDate,
                        expenseType: 'expense',
                    }
                ]
            };

            const res = await saveExpenseList(payload);
            if (res && res.success) {
                Alert.alert('Success', 'Expense request submitted successfully.', [
                    {
                        text: 'OK',
                        onPress: () => {
                            if (onSuccess) onSuccess();
                            handleClose();
                        }
                    }
                ]);
            } else {
                Alert.alert('Error', res?.message || 'Failed to submit expense request.');
            }
        } catch (error) {
            console.error('Submit expense error:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to submit expense request.';
            Alert.alert('Error', errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
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
                        <Text style={styles.modelTitle}>Add New Expense</Text>

                        <ScrollView
                            contentContainerStyle={styles.formContent}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            {/* Category Dropdown */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Expense Category</Text>
                                <TouchableOpacity
                                    style={styles.inputBox}
                                    activeOpacity={0.7}
                                    onPress={() => setShowCategoryPicker(!showCategoryPicker)}
                                >
                                    <View style={styles.dropdownHeader}>
                                        <Text style={[styles.dropdownSelectedText, !selectedCategory && styles.placeholderText]}>
                                            {selectedCategory ? selectedCategory.descE : 'Select Category'}
                                        </Text>
                                        <Icon name={showCategoryPicker ? 'chevron-up' : 'chevron-down'} size={20} color="#6A7282" />
                                    </View>
                                </TouchableOpacity>

                                {showCategoryPicker && (
                                    <View style={styles.dropdownList}>
                                        <View style={styles.searchBarContainer}>
                                            <Icon name="search" size={16} color="#9CA3AF" style={styles.searchIcon} />
                                            <TextInput
                                                style={styles.searchBar}
                                                placeholder="Search category..."
                                                placeholderTextColor="#9CA3AF"
                                                value={searchText}
                                                onChangeText={setSearchText}
                                                autoCapitalize="none"
                                            />
                                        </View>
                                        <ScrollView
                                            style={{ maxHeight: 156 }}
                                            nestedScrollEnabled={true}
                                            keyboardShouldPersistTaps="handled"
                                        >
                                            {isLoadingCategories ? (
                                                <ActivityIndicator size="small" color={theme.colors.purple} style={{ padding: 16 }} />
                                            ) : categories.filter(item =>
                                                (item.descE || '').toLowerCase().includes(searchText.toLowerCase()) ||
                                                (item.account_ID || '').includes(searchText)
                                            ).length === 0 ? (
                                                <Text style={styles.dropdownNoData}>No categories found</Text>
                                            ) : (
                                                categories
                                                    .filter(item =>
                                                        (item.descE || '').toLowerCase().includes(searchText.toLowerCase()) ||
                                                        (item.account_ID || '').includes(searchText)
                                                    )
                                                    .map((item, index) => (
                                                        <TouchableOpacity
                                                            key={item.account_ID || String(index)}
                                                            style={styles.dropdownItem}
                                                            onPress={() => {
                                                                setSelectedCategory(item);
                                                                setShowCategoryPicker(false);
                                                                setSearchText('');
                                                            }}
                                                        >
                                                            <Text style={styles.dropdownItemText}>{item.descE}</Text>
                                                            <Text style={styles.dropdownItemSub}>{item.account_ID}</Text>
                                                        </TouchableOpacity>
                                                    ))
                                            )}
                                        </ScrollView>
                                    </View>
                                )}
                            </View>

                            {/* Date Picker trigger */}
                            <TouchableOpacity
                                style={styles.inputGroup}
                                activeOpacity={0.7}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text style={styles.inputLabel}>Expense Date</Text>
                                <View style={[styles.inputBox, styles.dateInputInner]}>
                                    <Text style={[styles.dateInputText, !selectedDate && styles.placeholderText]}>
                                        {selectedDate ? selectedDate : 'YYYY-MM-DD'}
                                    </Text>
                                    <Icon name="calendar" size={18} color="#6A7282" />
                                </View>
                            </TouchableOpacity>

                            {/* Amount Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Amount (PKR)</Text>
                                <TextInput
                                    style={styles.inputBox}
                                    placeholder="Enter amount"
                                    placeholderTextColor={theme.colors.textMuted || '#9CA3AF'}
                                    value={amount}
                                    onChangeText={setAmount}
                                    keyboardType="numeric"
                                />
                            </View>

                            {/* Description Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Description</Text>
                                <TextInput
                                    style={[styles.inputBox, styles.textArea]}
                                    placeholder="Enter details of the expense"
                                    placeholderTextColor={theme.colors.textMuted || '#9CA3AF'}
                                    value={description}
                                    onChangeText={setDescription}
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
                                    <Text style={styles.submitBtnText}>Add Expense</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            <CalendarPickerModal
                visible={showDatePicker}
                onClose={() => setShowDatePicker(false)}
                onSelectDate={(date) => setSelectedDate(date)}
                selectedDate={selectedDate}
                title="Select Expense Date"
            />
        </>
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
        height: 100,
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
    dropdownHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownSelectedText: {
        fontSize: 16,
        color: '#0A0A0A',
    },
    placeholderText: {
        color: '#9CA3AF',
    },
    dropdownList: {
        marginTop: 6,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        backgroundColor: '#FFF',
        overflow: 'hidden',
        maxHeight: 200,
    },
    dropdownItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    dropdownItemText: {
        fontSize: 15,
        color: '#0A0A0A',
        flex: 1,
        marginRight: 8,
    },
    dropdownItemSub: {
        fontSize: 13,
        color: '#6B7280',
    },
    dropdownNoData: {
        padding: 16,
        textAlign: 'center',
        color: '#9CA3AF',
        fontSize: 15,
    },
    dateInputInner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateInputText: {
        fontSize: 16,
        color: '#0A0A0A',
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        backgroundColor: '#F9FAFB',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchBar: {
        flex: 1,
        height: 44,
        fontSize: 15,
        color: '#0A0A0A',
        paddingVertical: 0,
    },
});
