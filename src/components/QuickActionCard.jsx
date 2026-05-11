import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../theme/theme';

export default function QuickActionCard({ title, iconName, gradient, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <LinearGradient 
        colors={gradient} 
        style={styles.iconBox}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Icon name={iconName} size={24} color={theme.colors.white} />
      </LinearGradient>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textHeading,
    textAlign: 'center',
  },
});
