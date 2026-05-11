import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../theme/theme';

export default function StatCard({ title, value, iconName, gradient }) {
  return (
    <View style={styles.card}>
      <LinearGradient 
        colors={gradient} 
        style={styles.iconBox}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Icon name={iconName} size={20} color={theme.colors.white} />
      </LinearGradient>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
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
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.textHeading,
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: theme.colors.textMuted,
  },
});
