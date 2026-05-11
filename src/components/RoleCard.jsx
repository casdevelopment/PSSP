import React from 'react'
import { TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import LinearGradient from 'react-native-linear-gradient'
import { theme } from '../theme/theme'

export default function RoleCard({ title, description, icon, iconBgColor, onPress, isSelected }) {
  const gradientColors = Array.isArray(iconBgColor) ? iconBgColor : [iconBgColor, iconBgColor]

  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        isSelected && styles.cardSelected,
        isSelected && theme.shadow.card
      ]} 
      onPress={onPress} 
      activeOpacity={0.8}
    >
      <LinearGradient 
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconBox}
      >
        <Image source={icon} style={styles.icon} />
      </LinearGradient>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      {isSelected ? (
        <View style={styles.checkCircle}>
          <Icon name="check" size={16} color={theme.colors.white} />
        </View>
      ) : null}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    marginBottom: 16,
  },
  cardSelected: {
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle, 
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: theme.colors.white,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0A0A0A',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: theme.colors.textMuted,
    lineHeight: 20,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.linkPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  }
})
