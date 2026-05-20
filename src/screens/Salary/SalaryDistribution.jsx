import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';

// Components
import HeroCard from '../../components/HeroCard';

const DISTRIBUTION_DATA = [
  { id: '1', name: 'John Smith', subject: 'Mathematics', amount: '$3,200', date: 'Apr 25, 2026', status: 'Paid' },
  { id: '2', name: 'Emma Wilson', subject: 'Physics', amount: '$3,000', date: 'Apr 25, 2026', status: 'Paid' },
  { id: '3', name: 'David Brown', subject: 'English', amount: '$2,900', date: 'Due Apr 30', status: 'Pending' },
  { id: '4', name: 'Sarah Lee', subject: 'Chemistry', amount: '$3,100', date: 'Apr 25, 2026', status: 'Paid' },
  { id: '5', name: 'Michael Chen', subject: 'Biology', amount: '$3,000', date: 'Due Apr 30', status: 'Pending' },
];

export default function SalaryDistribution() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Current Month');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.backgroundLight} />
      
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>Salary Distribution</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Total Distribution Hero using Custom Component */}
        <View style={styles.heroWrapper}>
          <HeroCard
            topLabel="Total This Month"
            topIcon="dollar-sign"
            title="$15,200"
            subtitle="5 staff members • April 2026"
            colors={theme.gradients.green}
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'Current Month' ? styles.tabActive : styles.tabInactive]}
            onPress={() => setActiveTab('Current Month')}
          >
            <Text style={[styles.tabText, activeTab === 'Current Month' ? styles.tabTextActive : styles.tabTextInactive]}>
              Current Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'History' ? styles.tabActive : styles.tabInactive]}
            onPress={() => setActiveTab('History')}
          >
            <Text style={[styles.tabText, activeTab === 'History' ? styles.tabTextActive : styles.tabTextInactive]}>
              History
            </Text>
          </TouchableOpacity>
        </View>

        {/* Staff List */}
        <View style={styles.listContainer}>
          {DISTRIBUTION_DATA.map((record) => {
            const isPaid = record.status === 'Paid';
            return (
              <TouchableOpacity 
                key={record.id} 
                style={styles.recordCard}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('StaffSalaryDetails', { record })}
              >
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.staffName}>{record.name}</Text>
                    <Text style={styles.staffSubject}>{record.subject}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: isPaid ? theme.colors.successSubtle : theme.colors.pendingChipBg }]}>
                    <Text style={[styles.statusBadgeText, { color: isPaid ? theme.colors.successStrong : theme.colors.pendingChipText }]}>
                      {record.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardBottom}>
                  <View>
                    <Text style={styles.amountText}>{record.amount}</Text>
                    <View style={styles.dateRow}>
                      <Icon name="calendar" size={13} color={theme.colors.textMuted} style={{ marginRight: 6 }} />
                      <Text style={styles.dateText}>{record.date}</Text>
                    </View>
                  </View>
                  
                  {isPaid ? (
                    <View style={styles.paidCircle}>
                      <Icon name="check" size={16} color={theme.colors.successStrong} />
                    </View>
                  ) : (
                    <TouchableOpacity style={styles.payNowBtn}>
                      <Text style={styles.payNowBtnText}>Pay Now</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
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
  header: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: theme.colors.backgroundLight,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.textHeading,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroWrapper: {
    marginTop: 10,
    // Note: HeroCard has built-in paddingHorizontal: 16, so we wrap it without adding more padding here
  },
  tabsRow: {
    flexDirection: 'row',
    marginBottom: 20,
    marginHorizontal: 16, // Added to account for scroll padding removal
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: theme.colors.linkPrimary,
  },
  tabInactive: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
  },
  tabTextActive: {
    color: theme.colors.white,
  },
  tabTextInactive: {
    color: theme.colors.textBody,
  },
  listContainer: {
    gap: 12,
    paddingHorizontal: 16, // Added to account for scroll padding removal
  },
  recordCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceSubtle,
    paddingBottom: 16,
  },
  staffName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textHeading,
    marginBottom: 4,
  },
  staffSubject: {
    fontSize: 14,
    color: theme.colors.textBody,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.textHeading,
    marginBottom: 6,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  paidCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.successSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payNowBtn: {
    backgroundColor: theme.colors.successStrong,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  payNowBtnText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});