import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme/theme';

export default function HeroCard({
  colors,
  topLabel,
  topIcon,
  title,
  subtitle,
  rightActionText,
  onRightAction,
}) {
  return (
    <View style={styles.headerContainer}>
      <LinearGradient
        style={[styles.headerBox, theme.shadow.hero]}
        colors={colors || theme.gradients.blue}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.topRow}>
          <View style={styles.topLeft}>
            {topIcon && <Icon name={topIcon} size={16} color="rgba(255,255,255,0.8)" style={styles.topIcon} />}
            <Text style={styles.topLabel}>{topLabel}</Text>
          </View>
          {rightActionText && (
            <TouchableOpacity style={styles.rightActionBtn} onPress={onRightAction} activeOpacity={0.7}>
              <Text style={styles.rightActionText}>{rightActionText}</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  headerBox: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 16,
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topIcon: {
    marginRight: 8,
  },
  topLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.white,
    marginBottom: 8,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  rightActionBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  rightActionText: {
    color: theme.colors.white,
    fontSize: 13,
    fontWeight: '500',
  }
});