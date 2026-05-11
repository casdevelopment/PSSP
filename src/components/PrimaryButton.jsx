import React from 'react'
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native'
import { theme } from '../theme/theme'

export default function PrimaryButton({ title, onPress, style, disabled, showChevron = true }) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.button, disabled && styles.disabled, style]}
      activeOpacity={0.9}
      disabled={disabled}
    >
      <Text style={styles.text}>{title}</Text>
      {showChevron && (
        <View style={styles.chevWrap}>
          <Text style={styles.chev}>›</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.purple,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#6C5CE7',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  chevWrap: {
    marginLeft: 12,
    backgroundColor: 'transparent',
  },
  chev: {
    color: theme.colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
})
