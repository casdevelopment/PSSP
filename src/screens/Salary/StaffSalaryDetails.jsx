import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';

// Adjust path as needed for your project structure
import HeroCard from '../../components/HeroCard'; 

export default function StaffSalaryDetails() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();

  // Retrieve passed record or use fallback
  const record = route.params?.record || {
    name: 'John Smith',
    subject: 'Mathematics',
    amount: '$3,200',
    date: 'Apr 25, 2026',
    status: 'Paid',
    base: '$2,800',
    allowances: '$400',
    deductions: '$0',
  };

  const isPaid = record.status === 'Paid';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.successStrong} />

      {/* Green Header Block */}
      <View style={[styles.headerBg, { paddingTop: insets.top }]}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="chevron-left" size={24} color={theme.colors.white} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerTitles}>
          <Text style={styles.pageTitle}>Salary Details</Text>
          <Text style={styles.pageSubtitle}>{record.name}</Text>
        </View>
      </View>

{/* Total Amount Card (Floating) Replaced with HeroCard */}
      <View style={{ marginTop: -30 }}>
        <HeroCard
          // Using an array of white to ensure the LinearGradient renders as a solid white card
          colors={[theme.colors.white, theme.colors.white]} 
          
          // Passing a Text component directly into the string prop overrides the HeroCard's hardcoded white label
          topLabel={<Text style={{ color: theme.colors.textMuted }}>Total Amount</Text>} 
          
          title={record.amount}
          titleStyle={{ fontSize: 36, fontWeight: '800', color: theme.colors.textHeading }} 
          
          rightElement={
            <View 
              style={[
                styles.statusIconCircle, 
                { backgroundColor: isPaid ? theme.colors.successSubtle : theme.colors.pendingChipBg }
              ]}
            >
              <Icon 
                name={isPaid ? "check" : "dollar-sign"} 
                size={24} 
                color={isPaid ? theme.colors.successStrong : theme.colors.pendingChipText} 
              />
            </View>
          }
        >
          {/* Bottom section updated to use dark text and subtle borders for the white background */}
          <View style={[styles.amountBottom, { borderTopColor: theme.colors.surfaceSubtle }]}>
            <Icon name="calendar" size={14} color={theme.colors.textMuted} style={{ marginRight: 8 }} />
            <Text style={[styles.dateText, { color: theme.colors.textBody }]}>{record.date}</Text>
          </View>
        </HeroCard>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* NEW: Additional Information Card */}
        <View style={styles.additionalCard}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          <View style={styles.additionalRow}>
            <View style={styles.additionalBlockLeft}>
              <Text style={styles.additionalLabel}>Total Staff</Text>
              <Text style={styles.additionalValueBlue}>32</Text>
            </View>
            <View style={styles.additionalBlockRight}>
              <Text style={styles.additionalLabel}>Staff Salaries</Text>
              <Text style={styles.additionalValueGreen}>$102,400</Text>
            </View>
          </View>
        </View>

        {/* Staff Information */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Staff Information</Text>

          <View style={styles.infoRow}>
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.blueSurface }]}>
              <Icon name="user" size={18} color={theme.colors.linkPrimary} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{record.name}</Text>
            </View>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.purpleSurface }]}>
              <Icon name="user" size={18} color={theme.colors.accentPurple} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Subject</Text>
              <Text style={styles.infoValue}>{record.subject}</Text>
            </View>
          </View>
        </View>

        {/* Salary Breakdown */}
        <Text style={styles.sectionTitle}>Salary Breakdown</Text>
        <View style={styles.breakdownCard}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Base Salary</Text>
            <Text style={styles.breakdownValue}>{record.base || '$2,800'}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Allowances</Text>
            <Text style={styles.breakdownValue}>{record.allowances || '$400'}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Deductions</Text>
            <Text style={[styles.breakdownValue, { color: theme.colors.danger }]}>{record.deductions || '$0'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>{record.amount}</Text>
          </View>
        </View>

        {/* Conditional Bottom Button */}
        {isPaid ? (
          <TouchableOpacity style={styles.outlineBtn} activeOpacity={0.8}>
            <Icon name="download" size={18} color={theme.colors.textBody} style={{ marginRight: 8 }} />
            <Text style={styles.outlineBtnText}>Download Payslip</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.8}>
            <Icon name="dollar-sign" size={18} color={theme.colors.white} style={{ marginRight: 6 }} />
            <Text style={styles.primaryBtnText}>Pay Salary Now</Text>
          </TouchableOpacity>
        )}

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
    backgroundColor: theme.colors.successStrong,
    paddingBottom: 60,
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
  },
  amountBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceSubtle,
    paddingTop: 16,
  },
  statusIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
    iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  dateText: {
    fontSize: 14,
    color: theme.colors.textBody,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textHeading,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  
  // NEW Additional Info Styles
  additionalCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  additionalRow: {
    flexDirection: 'row',
    gap: 12,
  },
  additionalBlockLeft: {
    flex: 1,
    backgroundColor: theme.colors.blueSurface,
    borderRadius: 12,
    padding: 16,
  },
  additionalBlockRight: {
    flex: 1,
    backgroundColor: theme.colors.greenSurface,
    borderRadius: 12,
    padding: 16,
  },
  additionalLabel: {
    fontSize: 14,
    color: theme.colors.textBody,
    marginBottom: 8,
  },
  additionalValueBlue: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.linkPrimary,
  },
  additionalValueGreen: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.successStrong,
  },

  infoCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceSubtle,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoLabel: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textHeading,
  },
  breakdownCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
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
  primaryBtn: {
    flexDirection: 'row',
    backgroundColor: theme.colors.successStrong,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  primaryBtnText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  outlineBtn: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  outlineBtnText: {
    color: theme.colors.textBody,
    fontSize: 16,
    fontWeight: '600',
  },
});