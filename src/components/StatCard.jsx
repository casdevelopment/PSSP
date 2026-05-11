import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../theme/theme';

export default function StatCard({ title, value, trend, trendColor, iconName, gradient }) {
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
      <Text style={styles.title}>{title}</Text>
      <View style={styles.bottomRow}>
        <Text style={styles.value}>{value}</Text>
        <Text style={[styles.trend, { color: trendColor }]}>{trend}</Text>
      </View>
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
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.heading,
  },
  trend: {
    fontSize: 13,
    fontWeight: '600',
  },
});
