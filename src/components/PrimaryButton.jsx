import React from 'react'
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { theme } from '../theme/theme'

export default function PrimaryButton({ title, onPress, style, disabled, loading = false, showChevron = true }) {
  const isDisabled = disabled || loading

  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.buttonWrap, isDisabled && styles.disabled, style]}
      activeOpacity={0.9}
      disabled={isDisabled}
    >
      <LinearGradient
        colors={theme.gradients.button}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.button}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.white} />
        ) : (
          <>
            <Text style={styles.text}>{title}</Text>
            {showChevron && (
              <View style={styles.chevWrap}>
                <Text style={styles.chev}>›</Text>
              </View>
            )}
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
  buttonWrap: {
    borderRadius: theme.radius.pill || 28,
    shadowColor: '#155DFC',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  button: {
    paddingVertical: 18,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.pill || 28,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
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
