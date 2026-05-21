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
  rightElement, // Added to support custom right-side elements (like the check circle)
  children,     // Added to support custom bottom elements (like the date row)
  titleStyle,   // Added to support custom title sizing
  topLabelStyle, // Added to support custom Top Label styling (like changing color)
}) {
  return (
    <View style={styles.headerContainer}>
      <LinearGradient
        style={[styles.headerBox, theme.shadow.hero]}
        colors={colors || theme.gradients.blue}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Top Row: Just the Icon and Label now */}
        <View style={styles.topRow}>
          <View style={styles.topLeft}>
            {topIcon && <Icon name={topIcon} size={16} color="rgba(255,255,255,0.8)" style={styles.topIcon} />}
            <Text style={[styles.topLabel, topLabelStyle]}>{topLabel}</Text>
          </View>
        </View>

        {/* Title Row: Title on the left, rightElement on the right */}
        <View style={styles.titleRow}>
          <Text style={[styles.title, titleStyle]}>{title}</Text>

          {/* Render custom right element if provided, otherwise fallback to standard text button */}
          {rightElement ? rightElement : (
            rightActionText && (
              <TouchableOpacity style={styles.rightActionBtn} onPress={onRightAction} activeOpacity={0.7}>
                <Text style={styles.rightActionText}>{rightActionText}</Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

        {/* Render extra custom content at the bottom */}
        {children}
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
    alignItems: 'center',
    marginBottom: 2,
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Centers the right element with the title vertically
    marginBottom: 8,
    marginTop: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.white,
    flex: 1, // Ensures long titles wrap instead of pushing the right element off screen
    marginRight: 16, // Adds breathing room between the title and the right element
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