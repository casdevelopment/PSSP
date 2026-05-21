import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';

export default function SchoolDetail() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();

  // Retrieve passed data or use fallback
  const school = route.params?.school || {
    name: 'Greenwood High School',
    location: 'Downtown District',
    students: '450',
    staff: '32',
    score: '92%',
  };

  const RECENT_ACTIVITY = [
    { id: '1', title: 'Monthly salary distributed', date: 'Apr 25, 2026', highlight: '$38,400', icon: 'trending-up' },
    { id: '2', title: 'Lab equipment approved', date: 'Apr 22, 2026', highlight: '$2,400', icon: 'trending-up' },
    { id: '3', title: '3 leave requests approved', date: 'Apr 20, 2026', highlight: '', icon: 'trending-up' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />

      {/* Extended Purple Gradient Header */}
      <LinearGradient
        colors={theme.gradients.purple}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerBg, { paddingTop: insets.top + 10 }]}
      >
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="chevron-left" size={24} color={theme.colors.white} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerTitles}>
          <Text style={styles.pageTitle}>{school.name}</Text>
          <Text style={styles.pageSubtitle}>{school.location}</Text>
        </View>
      </LinearGradient>
              
        {/* Floating Top Info Card */}
        <View style={[styles.floatingCard, theme.shadow.card]}>
          <View style={styles.floatCol}>
            <Text style={styles.floatLabel}>Principal</Text>
            <Text style={styles.floatValue}>Sarah Johnson</Text>
          </View>
          <View style={styles.floatCol}>
            <Text style={styles.floatLabel}>Established</Text>
            <Text style={styles.floatValue}>1995</Text>
          </View>
        </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* 2x2 Grid Stats */}
        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            {/* Students */}
            <View style={styles.gridCard}>
              <View style={[styles.gridIconCircle, { backgroundColor: theme.colors.blueSurface }]}>
                <Icon name="users" size={20} color={theme.colors.linkPrimary} />
              </View>
              <Text style={styles.gridValue}>{school.students}</Text>
              <Text style={styles.gridLabel}>Students</Text>
            </View>

            {/* Staff */}
            <View style={styles.gridCard}>
              <View style={[styles.gridIconCircle, { backgroundColor: theme.colors.greenSurface }]}>
                <Icon name="user-check" size={20} color={theme.colors.successStrong} />
              </View>
              <Text style={styles.gridValue}>{school.staff}</Text>
              <Text style={styles.gridLabel}>Staff Members</Text>
            </View>
          </View>

          <View style={styles.gridRow}>
            {/* Performance */}
            <View style={styles.gridCard}>
              <View style={[styles.gridIconCircle, { backgroundColor: theme.colors.purpleSurface }]}>
                <Icon name="award" size={20} color={theme.colors.accentPurple} />
              </View>
              <Text style={styles.gridValue}>{school.score}</Text>
              <Text style={styles.gridLabel}>Performance</Text>
            </View>

            {/* Attendance */}
            <View style={styles.gridCard}>
              <View style={[styles.gridIconCircle, { backgroundColor: theme.colors.approvalCardBg }]}>
                <Icon name="calendar" size={20} color={theme.colors.warning} />
              </View>
              <Text style={styles.gridValue}>96%</Text>
              <Text style={styles.gridLabel}>Attendance</Text>
            </View>
          </View>
        </View>

        {/* Monthly Salary Card */}
        <View style={styles.salaryCard}>
          <View style={[styles.gridIconCircle, { backgroundColor: theme.colors.greenSurface, marginBottom: 0, marginRight: 16 }]}>
            <Icon name="dollar-sign" size={20} color={theme.colors.successStrong} />
          </View>
          <View>
            <Text style={styles.salaryLabel}>Monthly Salary</Text>
            <Text style={styles.salaryValue}>$38,400</Text>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activityContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          
          {RECENT_ACTIVITY.map((activity, index) => (
            <View 
              key={activity.id} 
              style={[
                styles.activityRow,
                index === RECENT_ACTIVITY.length - 1 && { borderBottomWidth: 0, paddingBottom: 0 }
              ]}
            >
              <View style={styles.activityIconCircle}>
                <Icon name={activity.icon} size={18} color={theme.colors.linkPrimary} />
              </View>
              
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDate}>{activity.date}</Text>
                {activity.highlight ? (
                  <Text style={styles.activityHighlight}>{activity.highlight}</Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  headerBg: {
    paddingBottom: 70, 
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
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
  headerTitles: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.white,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 16,
    color: theme.colors.white90,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    marginTop: 0, 
  },
  floatingCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginTop: -30,
    marginBottom: 20,
  },
  floatCol: {
    flex: 1,
  },
  floatLabel: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginBottom: 6,
  },
  floatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textHeading,
  },
  gridContainer: {
    marginBottom: 20,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  gridCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    ...theme.shadow.card,
  },
  gridIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  gridValue: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.textHeading,
    marginBottom: 4,
  },
  gridLabel: {
    fontSize: 14,
    color: theme.colors.textMuted,
  },
  salaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  salaryLabel: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginBottom: 2,
  },
  salaryValue: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.textHeading,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textHeading,
    marginBottom: 20,
  },
  activityContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  activityRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceSubtle,
  },
  activityIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.blueSurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  activityDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textHeading,
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginBottom: 4,
  },
  activityHighlight: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.successStrong,
  },
});