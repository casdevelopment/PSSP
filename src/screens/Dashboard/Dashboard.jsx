import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useAuthStore } from '../../store/AuthStore';
import { theme } from '../../theme/theme';
import StatCard from '../../components/StatCard';
import QuickActionCard from '../../components/QuickActionCard';
import LinearGradient from 'react-native-linear-gradient';

const Dashboard = () => {
  const logout = useAuthStore((state) => state.logout);
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient style={[styles.headerBox, { paddingTop: Math.max(insets.top, 50) }]}
          colors={theme.gradients.purple}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.welcomeText}>Welcome Back, Principal</Text>
              <Text style={styles.welcomeSubText}>Here's what's happening today</Text>
            </View>
            <TouchableOpacity onPress={logout} style={styles.bellBtn} activeOpacity={0.8}>
              <Icon name="bell" size={20} color={theme.colors.white} />
              <View style={styles.badge} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.statsGrid}>
          <StatCard
            title="Total Students"
            value="1,247"
            trend="+12%"
            trendColor={theme.colors.linkPrimary}
            iconName="users"
            gradient={theme.gradients.purple}
          />
          <StatCard
            title="Total Staff"
            value="89"
            trend="+5%"
            trendColor="#FFA000"
            iconName="user-check"
            gradient={theme.gradients.orange}
          />
          <StatCard
            title="Revenue"
            value="$245K"
            trend="+18%"
            trendColor={theme.gradients.green[0]}
            iconName="dollar-sign"
            gradient={theme.gradients.green}
          />
          <StatCard
            title="Attendance"
            value="94.5%"
            trend="+2.3%"
            trendColor={theme.colors.linkPrimary}
            iconName="trending-up"
            gradient={theme.gradients.blue}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>

        <View style={styles.quickActionsGrid}>
          <QuickActionCard
            title="Add Student"
            iconName="user-plus"
            gradient={theme.gradients.purple}
            onPress={() => { }}
          />
          <QuickActionCard
            title="View Attendance"
            iconName="clipboard"
            gradient={theme.gradients.orange}
            onPress={() => { }}
          />
          <QuickActionCard
            title="Manage Staff"
            iconName="briefcase"
            gradient={theme.gradients.green}
            onPress={() => { }}
          />
          <QuickActionCard
            title="View Reports"
            iconName="bar-chart-2"
            gradient={theme.gradients.blue}
            onPress={() => { }}
          />
        </View>

        <View style={styles.chartPlaceholderBox}>
          <View style={styles.chartHeader}>
            <Text style={styles.sectionTitle}>Attendance Trend</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.chartArea}>
            <Text style={styles.chartDesc}>Graph Area</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.appBackground,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerBox: {
    paddingHorizontal: 24,
    paddingBottom: 64,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.white,
    marginBottom: 6,
  },
  welcomeSubText: {
    fontSize: 14,
    color: theme.colors.textOnDarkMuted,
  },
  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFC107',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: -40,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textHeading,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  chartPlaceholderBox: {
    marginHorizontal: 20,
    marginTop: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    height: 180,
    ...theme.shadow.card,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  viewAllText: {
    color: theme.colors.purple,
    fontSize: 14,
    fontWeight: '500',
  },
  chartArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: 8,
  },
  chartDesc: {
    color: theme.colors.textMuted,
  }
});