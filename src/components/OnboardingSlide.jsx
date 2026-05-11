import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { theme } from '../theme/theme'

export default function OnboardingSlide({ icon, title, description, iconBg }) {
  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={iconBg}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconBox}
      >
        <Image source={icon} style={styles.iconImage} />
      </LinearGradient>

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
    width: 106,
    height: 106,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    shadowColor: theme.shadow.hero.shadowColor,
    shadowOpacity: theme.shadow.hero.shadowOpacity,
    shadowRadius: theme.shadow.hero.shadowRadius,
    shadowOffset: theme.shadow.hero.shadowOffset,
    elevation: 6,
  },
  iconImage: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
  title: {
    ...theme.typography.title,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  description: {
    ...theme.typography.caption,
    textAlign: 'center',
    maxWidth: 320,
  },
})
