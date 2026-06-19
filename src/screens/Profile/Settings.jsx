import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';
import { useAuthStore } from '../../store/AuthStore';

export default function Settings() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const role = useAuthStore((state) => state.userType);

  // Dynamic header background based on role
  const getHeaderGradient = () => {
    if (role === 'coordinator') return theme.gradients.purple;
    if (role === 'staff') return theme.gradients.green;
    return theme.gradients.blue; // Default/Principal
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Dynamic Header */}
      <LinearGradient
        colors={getHeaderGradient()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerBg, { paddingTop: insets.top + theme.spacing.md }]}
      >
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="chevron-left" size={24} color={theme.colors.white} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerTitlesContainer}>
          <Text style={styles.pageTitle}>Settings</Text>
          <Text style={styles.pageSubtitle}>Manage your preferences</Text>
        </View>
      </LinearGradient>

      {/* Menu Options (Floating overlap layout) */}
      <View style={styles.OptionsContainer}>

        {/* Notifications */}
        <TouchableOpacity style={styles.menuItemCard} activeOpacity={0.8} onPress={() => navigation.navigate('Notifications')}>
          <View style={styles.menuItemLeft}>
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.blueSurface }]}>
              <Icon name="bell" size={20} color={theme.colors.linkPrimary} />
            </View>
            <Text style={styles.menuItemText}>Notifications</Text>
          </View>
          <Icon name="chevron-right" size={20} color={theme.colors.textMutedAlt} />
        </TouchableOpacity>

        {/* Change Password */}
        <TouchableOpacity style={styles.menuItemCard} activeOpacity={0.8} onPress={() => navigation.navigate('ChangePassword')}>
          <View style={styles.menuItemLeft}>
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.blueSurface }]}>
              <Icon name="lock" size={20} color={theme.colors.linkPrimary} />
            </View>
            <Text style={styles.menuItemText}>Change Password</Text>
          </View>
          <Icon name="chevron-right" size={20} color={theme.colors.textMutedAlt} />
        </TouchableOpacity>

        {/* Help Center */}
        <TouchableOpacity style={styles.menuItemCard} activeOpacity={0.8} onPress={() => navigation.navigate('HelpCenter')}>
          <View style={styles.menuItemLeft}>
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.blueSurface }]}>
              <Icon name="help-circle" size={20} color={theme.colors.linkPrimary} />
            </View>
            <Text style={styles.menuItemText}>Help Center</Text>
          </View>
          <Icon name="chevron-right" size={20} color={theme.colors.textMutedAlt} />
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.appBackground,
  },
  headerBg: {
    paddingBottom: 40,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  headerTitlesContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xs,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.white,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 16,
    color: theme.colors.white90,
  },
  OptionsContainer: {
    paddingHorizontal: theme.spacing.md,
    marginTop: -20, // Negative margin to float items over the header curve
    paddingBottom: theme.spacing.xxl,
  },
  menuItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textHeading,
  },
});