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
    schoolName: 'Greenwood High School',
    locationAddress: 'Downtown District',
    locationName: 'Downtown District',
    totalStudent: 450,
    schoolEmployees: 32,
    dateOfEstablishment: '1995-01-01T00:00:00',
    principalName: 'Sarah Johnson',
    totalSchoolSalary: 38400,
  };

  const schoolName = school.schoolName || 'Unknown';
  const location = school.locationAddress || school.locationName || 'N/A';
  const principalName = school.principalName || 'N/A';
  const establishedYear = school.dateOfEstablishment
    ? new Date(school.dateOfEstablishment).getFullYear().toString()
    : 'N/A';
  const students = school.totalStudent !== undefined ? String(school.totalStudent) : '0';
  const staff = school.schoolEmployees !== undefined ? String(school.schoolEmployees) : '0';
  const salaryVal = school.totalSchoolSalary !== undefined
    ? `PKR ${Number(school.totalSchoolSalary).toLocaleString()}`
    : 'N/A';

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
          <Text style={styles.pageTitle}>{schoolName}</Text>
          <Text style={styles.pageSubtitle}>{location}</Text>
        </View>
      </LinearGradient>

      {/* Floating Top Info Card */}
      <View style={[styles.floatingCard, theme.shadow.card]}>
        <View style={styles.floatCol}>
          <Text style={styles.floatLabel}>Principal</Text>
          <Text style={styles.floatValue}>{principalName}</Text>
        </View>
        <View style={styles.floatCol}>
          <Text style={styles.floatLabel}>Established</Text>
          <Text style={styles.floatValue}>{establishedYear}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* 1x2 Grid Stats */}
        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            {/* Students */}
            <View style={styles.gridCard}>
              <View style={[styles.gridIconCircle, { backgroundColor: theme.colors.blueSurface }]}>
                <Icon name="users" size={20} color={theme.colors.linkPrimary} />
              </View>
              <Text style={styles.gridValue}>{students}</Text>
              <Text style={styles.gridLabel}>Students</Text>
            </View>

            {/* Staff */}
            <View style={styles.gridCard}>
              <View style={[styles.gridIconCircle, { backgroundColor: theme.colors.greenSurface }]}>
                <Icon name="user-check" size={20} color={theme.colors.successStrong} />
              </View>
              <Text style={styles.gridValue}>{staff}</Text>
              <Text style={styles.gridLabel}>Staff Members</Text>
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
            <Text style={styles.salaryValue}>{salaryVal}</Text>
          </View>
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
    marginBottom: 10,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 10,
  },
  gridCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
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
    marginBottom: 20,
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
  }
});