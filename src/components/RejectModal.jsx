import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';

export default function RejectModal({
  visible,
  onClose,
  onConfirm,
  title = 'Reject Request',
  subtitle = 'Please enter remarks for rejecting this request.',
  placeholder = 'Enter remarks...',
  isOperating = false,
}) {
  const insets = useSafeAreaInsets();
  const [remarks, setRemarks] = useState('');

  // Reset remarks when modal visibility changes
  useEffect(() => {
    if (!visible) {
      setRemarks('');
    }
  }, [visible]);

  const handleClose = () => {
    setRemarks('');
    onClose();
  };

  const handleConfirm = () => {
    if (!remarks.trim()) return;
    onConfirm(remarks.trim());
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.modalBg}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.modalDismiss} onPress={handleClose} />

        <View style={[styles.modalContent, { paddingBottom: insets.bottom + 24 }]}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalSubtitle}>{subtitle}</Text>
          
          <TextInput
            style={styles.modalTextInput}
            multiline
            numberOfLines={4}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textMuted || '#9CA3AF'}
            value={remarks}
            onChangeText={setRemarks}
            textAlignVertical="top"
            editable={!isOperating}
          />

          <View style={styles.modalButtonsRow}>
            <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={handleClose}
              disabled={isOperating}
            >
              <Text style={styles.modalCancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalConfirmBtn,
                (!remarks.trim() || isOperating) && styles.modalConfirmBtnDisabled
              ]}
              disabled={!remarks.trim() || isOperating}
              onPress={handleConfirm}
            >
              {isOperating ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.modalConfirmBtnText}>Reject</Text>
              )}
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalDismiss: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    ...theme.shadow.card,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.textHeading || '#0A0A0A',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: theme.colors.textBody || '#4A5565',
    marginBottom: 16,
  },
  modalTextInput: {
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle || '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: theme.colors.textHeading || '#0A0A0A',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
    backgroundColor: '#FFF',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalCancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textMuted || '#9CA3AF',
  },
  modalConfirmBtn: {
    backgroundColor: theme.colors.dangerStrong || '#DC2626',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 90,
  },
  modalConfirmBtnDisabled: {
    opacity: 0.5,
  },
  modalConfirmBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFF',
  },
});
