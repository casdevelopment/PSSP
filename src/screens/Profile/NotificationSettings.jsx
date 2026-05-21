import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';
import { useAuthStore } from '../../store/AuthStore';

export default function NotificationSettings() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const role = useAuthStore((state) => state.role);

  const [settings, setSettings] = useState({
    salary: true,
    expense: true,
    leave: true,
    monthly: false,
    announcements: true,
  });

  const toggleSetting = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  // Dynamic header based on role
  const getHeaderGradient = () => {
    if (role === 'coordinator') return theme.gradients.purple;
    if (role === 'staff') return theme.gradients.green;
    return theme.gradients.blue; 
  };

  const getRoleColor = () => {
    if (role === 'coordinator') return theme.colors.purple;
    if (role === 'staff') return theme.colors.successStrong;
    return theme.colors.linkPrimary;
  };

  const SettingItem = ({ title, subtitle, value, onValueChange }) => (
    <View style={styles.settingCard}>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      <Switch
        trackColor={{ false: theme.colors.borderSubtle, true: getRoleColor() }}
        thumbColor={theme.colors.white}
        ios_backgroundColor={theme.colors.borderSubtle}
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );

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
          <Text style={styles.pageTitle}>Notifications</Text>
          <Text style={styles.pageSubtitle}>Manage your notification preferences</Text>
        </View>
      </LinearGradient>

      {/* List Area */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.contentWrap}>
            <SettingItem 
              title="Salary Notifications" 
              subtitle="Get notified about salary payments" 
              value={settings.salary} 
              onValueChange={() => toggleSetting('salary')} 
            />
            <SettingItem 
              title="Expense Requests" 
              subtitle="New expense approval requests" 
              value={settings.expense} 
              onValueChange={() => toggleSetting('expense')} 
            />
            <SettingItem 
              title="Leave Requests" 
              subtitle="New leave approval requests" 
              value={settings.leave} 
              onValueChange={() => toggleSetting('leave')} 
            />
            <SettingItem 
              title="Monthly Reports" 
              subtitle="Monthly performance reports" 
              value={settings.monthly} 
              onValueChange={() => toggleSetting('monthly')} 
            />
            <SettingItem 
              title="Announcements" 
              subtitle="Important system announcements" 
              value={settings.announcements} 
              onValueChange={() => toggleSetting('announcements')} 
            />
        </View>
        <View style={{height: 40}} />
      </ScrollView>
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
    zIndex: 1,
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
  scrollView: {
    marginTop: -30,
    zIndex: 5,
    elevation: 5,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxl,
  },
  contentWrap: {
    paddingHorizontal: 16,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  settingTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textHeading,
    marginBottom: 6,
  },
  settingSubtitle: {
    fontSize: 14,
    color: theme.colors.textBody,
  },
});