import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';

// Update import path based on your file structure
import HeroCard from '../../components/HeroCard'; 

export default function MySalary() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const HISTORY_DATA = [
    { id: '1', month: 'March 2026', date: 'Mar 25, 2026', amount: '$3,200', status: 'Received' },
    { id: '2', month: 'February 2026', date: 'Feb 25, 2026', amount: '$3,200', status: 'Received' },
    { id: '3', month: 'January 2026', date: 'Jan 25, 2026', amount: '$3,200', status: 'Received' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.backgroundLight} />
      
      {/* Current Month Hero Using Reusable HeroCard */}
      <View style={{ marginTop: 10 }}>
        <HeroCard
          colors={theme.gradients.green}
          topLabel="Current Month"
          topIcon="dollar-sign"
          title="$3,200"
          subtitle="April 2026"
          titleStyle={styles.heroAmount}
          rightElement={
            <View style={styles.checkCircle}>
              <Icon name="check" size={20} color={theme.colors.white} />
            </View>
          }
        >
          {/* Injected custom bottom row */}
          <View style={styles.heroBottomRow}>
            <Icon name="calendar" size={14} color={theme.colors.white90} style={{ marginRight: 6 }} />
            <Text style={styles.heroDate}>Received on Apr 25, 2026</Text>
          </View>
        </HeroCard>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Salary Breakdown */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Salary Breakdown</Text>

          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Base Salary</Text>
            <Text style={styles.breakdownValue}>$2,800</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Allowances</Text>
            <Text style={styles.breakdownValue}>$400</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Deductions</Text>
            <Text style={[styles.breakdownValue, { color: theme.colors.danger }]}>-$0</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>$3,200</Text>
          </View>
        </View>

        {/* Salary History Preview */}
        <View style={styles.historyHeader}>
          <Text style={styles.sectionTitle}>Salary History</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SalaryHistory')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionCard}>
          {HISTORY_DATA.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('SalaryDetail', { month: item.month })}
            >
              <View style={[styles.historyRow, index === HISTORY_DATA.length - 1 && { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 }]}>
                <View>
                  <Text style={styles.historyMonth}>{item.month}</Text>
                  <Text style={styles.historyDate}>{item.date}</Text>
                </View>
                <View style={styles.historyRight}>
                  <Text style={styles.historyAmount}>{item.amount}</Text>
                  <View style={styles.statusRow}>
                    <Icon name="check" size={14} color={theme.colors.successStrong} style={{ marginRight: 4 }} />
                    <Text style={styles.statusText}>Received</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Download Button */}
        <TouchableOpacity style={styles.outlineBtn}>
          <Icon name="download" size={18} color={theme.colors.textHeading} style={{ marginRight: 8 }} />
          <Text style={styles.outlineBtnText}>Download Payslip</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  // Custom styles specifically for the Salary Hero
  heroAmount: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 2,
  },
  checkCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 16,
    marginTop: 8,
  },
  heroDate: {
    fontSize: 14,
    color: theme.colors.white90,
  },
  // Standard screen styles below
  sectionCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textHeading,
    marginBottom: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  breakdownLabel: {
    fontSize: 15,
    color: theme.colors.textBody,
  },
  breakdownValue: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textHeading,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.borderSubtle,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.textHeading,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.successStrong,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.linkPrimary,
    marginBottom: 16,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceSubtle,
    marginBottom: 4,
  },
  historyMonth: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textHeading,
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textHeading,
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.successStrong,
  },
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 20,
  },
  outlineBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textHeading,
  },
});