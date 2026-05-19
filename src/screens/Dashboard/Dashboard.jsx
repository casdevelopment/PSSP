import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useAuthStore } from '../../store/AuthStore';
import { theme } from '../../theme/theme';
import StatCard from '../../components/StatCard';
import QuickActionCard from '../../components/QuickActionCard';
import TodaySchedule from '../../components/TodaySchedule';
import PendingCard from '../../components/PendingCard';
import RecentNotifications from '../../components/RecentNotifications';
import RecentSchools from '../../components/RecentSchools';
import HeroCard from '../../components/HeroCard';
import { useNavigation } from '@react-navigation/native';
import { getQuickActions } from '../../utils/QuickActions';

const Dashboard = () => {
  const navigation = useNavigation();
  const user = useAuthStore((state) => state.user);
  const role = user?.role;
  const insets = useSafeAreaInsets();

  const quickActions = getQuickActions(role, navigation);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {(!role || role === 'principal' || role === 'staff' || role === 'coordinator') && (
          <>
            {(!role || role === 'principal' || role === 'staff') && (
              <HeroCard
                colors={theme.gradients.blue}
                topLabel="Greenwood High School"
                title={`Welcome, ${user?.name || 'User'}!`}
                subtitle="Thursday, April 30, 2026"
              />
            )}
            <View style={styles.statsGrid}>
              <StatCard
                title="Total Staff"
                value="32"
                iconName="users"
                gradient={theme.gradients.blue}
              />
              <StatCard
                title="Students"
                value="450"
                iconName="square"
                gradient={theme.gradients.green}
              />
              <StatCard
                title="Attendance"
                value="96%"
                iconName="calendar"
                gradient={theme.gradients.purple}
              />
              <StatCard
                title="Leave Requests"
                value="4"
                iconName="alert-circle"
                gradient={theme.gradients.orange}
              />
            </View>

            <View style={styles.bottomCardBox}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
              </View>

              <View style={styles.quickActionsList}>
                {quickActions.map((action, index) => (
                  <QuickActionCard
                    key={index}
                    title={action.title}
                    bgColor={action.bgColor}
                    textColor={action.textColor}
                    onPress={action.onPress}
                  />
                ))}
              </View>
            </View>

            {(role === 'coordinator') ? (
              <RecentSchools />
            ) : (
              <TodaySchedule />
            )}


            {(!role || role === 'principal' || role === 'coordinator') && (
              <PendingCard />
            )}

          </>
        )}
            {(!role || role === 'staff') && (
              <RecentNotifications />
            )}

          </ScrollView>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Light mode bg
  },
  scrollContent: {
    paddingTop: 10, // accommodate safe area
    paddingBottom: 40,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  bottomCardBox: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textHeading,
  },
  quickActionsList: {
    flexDirection: 'column',
  },
});