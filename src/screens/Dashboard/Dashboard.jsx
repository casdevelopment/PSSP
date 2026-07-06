import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, RefreshControl } from 'react-native';
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
import { getUserDashboard } from '../../network/apis';
import { useProfileDetailsStore } from '../../store/ProfileDetailsStore';

const Dashboard = () => {
  const navigation = useNavigation();
  const empId = useAuthStore((state) => state.empId);
  const role = useAuthStore((state) => state.userType);
  const insets = useSafeAreaInsets();

  const dashboardData = useProfileDetailsStore((state) => state.profileDetails);
  const setDashboardData = useProfileDetailsStore((state) => state.setProfileDetails);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const quickActions = getQuickActions(role, navigation);

  const fetchDashboard = useCallback(async (showLoader = true) => {
    if (!empId) return;
    try {
      if (showLoader) setIsLoading(true);
      setError(null);
      const response = await getUserDashboard(empId);
      if (response && response.success) {
        setDashboardData(response.data);
        console.log(response.data)
      } else {
        setError(response?.message || 'Failed to load dashboard data');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [empId, setDashboardData]);

  useEffect(() => {
    fetchDashboard(true);
  }, [fetchDashboard]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDashboard(false);
  };

  const getStatsCards = () => {
    // If no dashboard data is loaded yet, return placeholder items with zero values
    if (!dashboardData) {
      if (role === 'staff') {
        return [
          { title: 'My Classes', value: '0', iconName: 'book-open', gradient: theme.gradients.blue },
          { title: 'Students', value: '0', iconName: 'users', gradient: theme.gradients.green },
          { title: 'Attendance', value: '0%', iconName: 'calendar', gradient: theme.gradients.purple },
          { title: 'This Months Salary', value: 'Rs. 0', iconName: 'credit-card', gradient: theme.gradients.orange },
        ];
      } else if (role === 'coordinator') {
        return [
          { title: 'Total Schools', value: '0', iconName: 'home', gradient: theme.gradients.blue },
          { title: 'Total Staff', value: '0', iconName: 'users', gradient: theme.gradients.green },
          { title: 'Monthly Salary', value: 'Rs. 0', iconName: 'credit-card', gradient: theme.gradients.purple },
          { title: 'Pending Requests', value: '0', iconName: 'clock', gradient: theme.gradients.orange },
        ];
      } else {
        return [
          { title: 'Total Staff', value: '0', iconName: 'users', gradient: theme.gradients.blue },
          { title: 'Students', value: '0', iconName: 'users', gradient: theme.gradients.green },
          { title: 'Attendance', value: '0%', iconName: 'calendar', gradient: theme.gradients.purple },
          { title: 'Leave Requests', value: '0', iconName: 'alert-circle', gradient: theme.gradients.orange },
        ];
      }
    }

    if (role === 'staff') {
      return [
        {
          title: 'My Classes',
          value: String(dashboardData.totalClasses ?? 0),
          iconName: 'book-open',
          gradient: theme.gradients.blue,
        },
        {
          title: 'Students',
          value: String(dashboardData.totalStudents ?? 0),
          iconName: 'users',
          gradient: theme.gradients.green,
        },
        {
          title: 'Attendance',
          value: `${dashboardData.currentMonthAttendancePercentage ?? 0}%`,
          iconName: 'calendar',
          gradient: theme.gradients.purple,
        },
        {
          title: 'This Months Salary',
          value: `Rs. ${(dashboardData.currentSalary ?? 0).toLocaleString()}`,
          iconName: 'credit-card',
          gradient: theme.gradients.orange,
        },
      ];
    } else if (role === 'coordinator') {
      return [
        {
          title: 'Total Schools',
          value: String(dashboardData.totalSchools ?? dashboardData.schoolsCount ?? 0),
          iconName: 'home',
          gradient: theme.gradients.blue,
        },
        {
          title: 'Total Staff',
          value: String(dashboardData.totalStaff ?? dashboardData.staffCount ?? 0),
          iconName: 'users',
          gradient: theme.gradients.green,
        },
        {
          title: 'Monthly Salary',
          value: `Rs. ${(dashboardData.monthlySalary ?? dashboardData.currentSalary ?? 0).toLocaleString()}`,
          iconName: 'credit-card',
          gradient: theme.gradients.purple,
        },
        {
          title: 'Pending Requests',
          value: String(dashboardData.pendingRequests ?? dashboardData.totalPendingRequests ?? 0),
          iconName: 'clock',
          gradient: theme.gradients.orange,
        },
      ];
    } else {
      // principal
      return [
        {
          title: 'Total Staff',
          value: String(dashboardData.totalStaff ?? dashboardData.staffCount ?? 0),
          iconName: 'users',
          gradient: theme.gradients.blue,
        },
        {
          title: 'Students',
          value: String(dashboardData.totalStudents ?? dashboardData.studentsCount ?? 0),
          iconName: 'users',
          gradient: theme.gradients.green,
        },
        {
          title: 'Attendance',
          value: `${dashboardData.currentMonthAttendancePercentage ?? dashboardData.attendancePercentage ?? dashboardData.attendance ?? 0}%`,
          iconName: 'calendar',
          gradient: theme.gradients.purple,
        },
        {
          title: 'Leave Requests',
          value: String(dashboardData.leaveRequests ?? dashboardData.totalLeaveRequests ?? dashboardData.pendingLeaveRequests ?? 0),
          iconName: 'alert-circle',
          gradient: theme.gradients.orange,
        },
      ];
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {isLoading && !isRefreshing && !dashboardData ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.purple} />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      ) : error && !dashboardData ? (
        <View style={styles.errorContainer}>
          <Icon name="alert-triangle" size={48} color={theme.colors.danger} />
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorSubTitle}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchDashboard(true)}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 80 }]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.purple]}
              tintColor={theme.colors.purple}
            />
          }
        >
          {(!role || role === 'principal' || role === 'staff' || role === 'coordinator') && (
            <>
              {(!role || role === 'principal' || role === 'staff') && (
                <HeroCard
                  colors={theme.gradients.blue}
                  topLabel={dashboardData?.schoolName || 'Greenwood High School'}
                  title={`Welcome, ${dashboardData?.employeeName || 'User'}!`}
                  subtitle={dashboardData?.currentDate || new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                />
              )}
              <View style={styles.statsGrid}>
                {getStatsCards().map((card, index) => (
                  <StatCard
                    key={index}
                    title={card.title}
                    value={card.value}
                    iconName={card.iconName}
                    gradient={card.gradient}
                  />
                ))}
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
          {/* {(!role || role === 'staff') && (
            <RecentNotifications />
          )} */}

        </ScrollView>
      )}
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.textMuted,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#F9FAFB',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.textHeading,
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubTitle: {
    fontSize: 14,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: theme.colors.purple,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    ...theme.shadow.card,
  },
  retryButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});