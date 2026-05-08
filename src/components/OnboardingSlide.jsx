import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { theme } from '../theme/theme'

export default function OnboardingSlide({ icon, title, description, iconBg }) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.iconBox, { backgroundColor: iconBg || theme.colors.statPurple }]}>
        <Text style={styles.icon}>{icon || '▣'}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  iconBox: {
    width: 96,
    height: 96,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    shadowColor: theme.shadow.hero.shadowColor,
    shadowOpacity: theme.shadow.hero.shadowOpacity,
    shadowRadius: theme.shadow.hero.shadowRadius,
    shadowOffset: theme.shadow.hero.shadowOffset,
    elevation: 6,
  },
  icon: {
    color: theme.colors.white,
    fontSize: 40,
    fontWeight: '700',
  },
  title: {
    ...theme.typography.title,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  description: {
    ...theme.typography.caption,
    textAlign: 'center',
    maxWidth: 320,
  },
})
