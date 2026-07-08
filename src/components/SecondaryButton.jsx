import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function SecondaryButton({
  title,
  onPress,
  style,
  textStyle,
  disabled,
  loading = false,
  variant = 'cancel', // 'cancel' | 'danger' | 'success'
  icon,
  iconSize = 18,
}) {
  const isDisabled = disabled || loading;

  // Presets mapping
  const presets = {
    cancel: {
      bg: '#F3F4F6',
      border: 'transparent',
      text: '#4B5563',
      loader: '#4B5563',
    },
    danger: {
      bg: '#FEE2E2',
      border: '#FCA5A5',
      text: '#DC2626',
      loader: '#DC2626',
    },
    success: {
      bg: '#DCFCE7',
      border: '#86EFAC',
      text: '#15803D',
      loader: '#15803D',
    },
  };

  const currentPreset = presets[variant] || presets.cancel;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: currentPreset.bg,
          borderColor: currentPreset.border,
          borderWidth: currentPreset.border !== 'transparent' ? 1 : 0,
        },
        isDisabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.8}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color={currentPreset.loader} />
      ) : (
        <View style={styles.content}>
          {icon && (
            <Icon
              name={icon}
              size={iconSize}
              color={currentPreset.text}
              style={styles.icon}
            />
          )}
          <Text style={[styles.text, { color: currentPreset.text }, textStyle]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
  icon: {
    marginRight: 6,
  },
});
