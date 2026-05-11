import React from 'react'
import { TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import LinearGradient from 'react-native-linear-gradient'
import { theme } from '../theme/theme'

export default function RoleCard({ title, description, icon, iconBgColor, onPress }) {
  const gradientColors = Array.isArray(iconBgColor) ? iconBgColor : [iconBgColor, iconBgColor]

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient 
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.iconBox, theme.shadow.card]}
      >
        <Image source={icon} style={styles.icon} />
      </LinearGradient>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Icon name="chevron-right" size={24} color={theme.colors.textMuted} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: 24,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    marginBottom: theme.spacing.lg,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  icon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    tintColor: theme.colors.white,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: theme.spacing.lg,
    fontWeight: '800',
    color: theme.colors.textHeading,
    marginBottom: 8,
  },
  description: {
    fontSize: theme.spacing.sm,
    color: theme.colors.textMuted,
    lineHeight: 24,
  },
})
