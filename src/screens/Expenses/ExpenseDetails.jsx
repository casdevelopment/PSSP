import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';

// Components
import HeroCard from '../../components/HeroCard';

export default function ExpenseDetails() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();

  // Retrieve passed record or use fallback
  const record = route.params?.record || {
    title: 'Lab Equipment',
    school: 'Greenwood High School',
    amount: '$2,400',
    date: 'Apr 28, 2026',
    status: 'Pending',
    category: 'Academic',
    description: 'Chemistry lab equipment including beakers, test tubes, microscopes, and safety equipment for student experiments.',
  };

  const isApproved = record.status === 'Approved';
  const isPending = record.status === 'Pending';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF7F00" />

      {/* Orange Header Block */}
      <View style={[styles.headerBg, { paddingTop: insets.top }]}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="chevron-left" size={24} color={theme.colors.white} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerTitles}>
          <Text style={styles.pageTitle}>Expense Request</Text>
          <Text style={styles.pageSubtitle}>{record.title}</Text>
        </View>
      </View>

      {/* Refactored using HeroCard Component */}
      <View style={styles.floatingHeroContainer}>
        <HeroCard
          colors={[theme.colors.white, theme.colors.white]} // Solid white background override
          topLabel="Total Amount"
          topLabelStyle={{ color: theme.colors.textMuted }} // FIXED: Passes the gray theme color prop seamlessly
          topIcon="" 
          title={record.amount}
          titleStyle={styles.customHeroTitle}
          rightElement={
            <View style={[
              styles.statusBadge, 
              { backgroundColor: isApproved ? theme.colors.successSubtle : theme.colors.pendingChipBg }
            ]}>
              <Text style={[
                styles.statusBadgeText, 
                { color: isApproved ? theme.colors.successStrong : theme.colors.pendingChipText }
              ]}>
                {record.status}
              </Text>
            </View>
          }
        >
          {/* Calendar Date Footer injected as children */}
          <View style={styles.amountBottom}>
            <Icon name="calendar" size={14} color={theme.colors.textMuted} style={{ marginRight: 8 }} />
            <Text style={styles.dateText}>Requested on {record.date}</Text>
          </View>
        </HeroCard>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Request Information */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Request Information</Text>

          <View style={styles.infoRow}>
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.blueSurface }]}>
              <Icon name="trello" size={18} color={theme.colors.linkPrimary} />
            </View>
            <View>
              <Text style={styles.infoLabel}>School</Text>
              <Text style={styles.infoValue}>{record.school}</Text>
            </View>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 }]}>
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.purpleSurface }]}>
              <Icon name="file-text" size={18} color={theme.colors.accentPurple} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Category</Text>
              <Text style={styles.infoValue}>{record.category || 'Academic'}</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descText}>{record.description}</Text>
        </View>

        {/* Item Breakdown */}
        <View style={styles.breakdownCard}>
          <Text style={styles.sectionTitle}>Item Breakdown</Text>
          
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Microscopes (5x)</Text>
            <Text style={styles.breakdownValue}>$1,200</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Lab Safety Equipment</Text>
            <Text style={styles.breakdownValue}>$600</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Glassware Set</Text>
            <Text style={styles.breakdownValue}>$400</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Chemical Supplies</Text>
            <Text style={styles.breakdownValue}>$200</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>{record.amount}</Text>
          </View>
        </View>

      </ScrollView>

      {/* FIXED: Bottom Action Bar (Approve/Reject) wrapped in conditional rendering */}
      {isPending && (
        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <TouchableOpacity style={styles.rejectBtn} activeOpacity={0.8}>
            <Icon name="x" size={18} color={theme.colors.dangerStrong} style={{ marginRight: 6 }} />
            <Text style={styles.rejectBtnText}>Reject</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.approveBtn} activeOpacity={0.8}>
            <Icon name="check" size={18} color={theme.colors.white} style={{ marginRight: 6 }} />
            <Text style={styles.approveBtnText}>Approve</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  headerBg: {
    backgroundColor: '#FF7F00', 
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
    paddingBottom: 40,
  },
  floatingHeroContainer: {
    marginTop: -45, 
  },
  customHeroTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: theme.colors.textHeading, 
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  statusBadgeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  amountBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceSubtle,
    paddingTop: 16,
    marginTop: 8,
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
  },
  infoCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    marginBottom: 8,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
  descText: {
    fontSize: 15,
    lineHeight: 24,
    color: theme.colors.textBody,
  },
  breakdownCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
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
    color: '#FF7F00',
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderSubtle,
    gap: 12,
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.dangerSubtle,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectBtnText: {
    color: theme.colors.dangerStrong,
    fontSize: 16,
    fontWeight: '700',
  },
  approveBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.successStrong,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  approveBtnText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});