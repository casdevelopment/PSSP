import React from 'react';
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

const EXPENSES_DATA = [
  { id: '1', title: 'Lab Equipment', school: 'Greenwood High', amount: '$2,400', date: 'Apr 28, 2026', status: 'Pending' },
  { id: '2', title: 'Sports Equipment', school: 'Riverside Academy', amount: '$1,800', date: 'Apr 27, 2026', status: 'Pending' },
  { id: '3', title: 'Library Books', school: 'Maple Valley', amount: '$1,200', date: 'Apr 26, 2026', status: 'Approved' },
  { id: '4', title: 'Computer Lab', school: 'Sunset Elementary', amount: '$3,500', date: 'Apr 25, 2026', status: 'Pending' },
];

export default function ExpenseRequests() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.backgroundLight} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Custom Hero Card for Pending Approvals */}
        <View style={styles.heroWrapper}>
          <HeroCard
            topLabel="Pending Approval"
            topIcon="file-text"
            title="3"
            subtitle="Total: $7,700"
            colors={theme.gradients.darkOrange}
          />
        </View>

        {/* Expenses List */}
        <View style={styles.listContainer}>
          {EXPENSES_DATA.map((record) => {
            const isApproved = record.status === 'Approved';
            
            return (
              <TouchableOpacity 
                key={record.id} 
                style={styles.recordCard}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('ExpenseDetails', { record })}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.titleWrap}>
                    <Text style={styles.expenseTitle}>{record.title}</Text>
                    <Text style={styles.schoolText}>{record.school}</Text>
                  </View>
                  
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
                </View>

                <View style={styles.cardBottom}>
                  <Text style={styles.amountText}>{record.amount}</Text>
                  <View style={styles.dateRow}>
                    <Text style={styles.dateText}>{record.date}</Text>
                    <Icon name="chevron-right" size={16} color={theme.colors.textMuted} style={{ marginLeft: 6 }} />
                  </View>
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
  scrollContent: {
    paddingBottom: 100,
  },
  heroWrapper: {
    marginTop: 10,
  },
  listContainer: {
    gap: 12,
    paddingHorizontal: 16,
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
  },
  titleWrap: {
    flex: 1,
    marginRight: 10,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textHeading,
    marginBottom: 4,
  },
  schoolText: {
    fontSize: 14,
    color: theme.colors.textBody,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
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
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
});