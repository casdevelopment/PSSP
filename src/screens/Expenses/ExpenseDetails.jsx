import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';
import { useAuthStore } from '../../store/AuthStore';
import { getExpenseDetailsWithSchool, postExpense, deleteExpense } from '../../network/apis';

// Components
import HeroCard from '../../components/HeroCard';

export default function ExpenseDetails() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const userId = useAuthStore((state) => state.userId);
  const role = useAuthStore((state) => state.userType);

  const record = route.params?.record;
  const expId = record?.id || '0';

  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOperating, setIsOperating] = useState(false);

  const fetchDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getExpenseDetailsWithSchool(expId);
      if (response && response.success) {
        const dataArr = response.data || [];
        if (dataArr.length > 0) {
          setDetail(dataArr[0]);
        } else {
          setError('No expense details found.');
        }
      } else {
        setError(response?.message || 'Failed to load expense details.');
      }
    } catch (err) {
      console.error('Error fetching expense details:', err);
      setError(err.message || 'An error occurred while loading details.');
    } finally {
      setIsLoading(false);
    }
  }, [expId]);

  useEffect(() => {
    if (expId && expId !== '0') {
      fetchDetails();
    } else {
      setError('Invalid expense request ID.');
      setIsLoading(false);
    }
  }, [expId, fetchDetails]);

  const handleAction = async (saveMode) => {
    if (!detail) return;
    try {
      setIsOperating(true);
      let response;
      if (saveMode === 'delete') {
        const payload = {
          expenseId: Number(detail.expID) || 0,
          userId: Number(userId) || 0
        };
        response = await deleteExpense(payload);
      } else {
        const payload = {
          userId: Number(userId) || 0,
          schoolId: Number(detail.schoolID) || 0,
          saveMode: String(saveMode),
          expenses: [
            {
              expenseId: Number(detail.expID) || 0
            }
          ]
        };
        response = await postExpense(payload);
      }

      if (response && response.success) {
        Alert.alert(
          'Success',
          saveMode === 'Insert' ? 'Expense successfully approved.' : 'Expense successfully rejected.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        Alert.alert('Error', response?.message || 'Failed to process expense request.');
      }
    } catch (err) {
      console.error('Error processing expense action:', err);
      Alert.alert('Error', err.message || 'An error occurred while processing action.');
    } finally {
      setIsOperating(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#FF7F00" />
        <ActivityIndicator size="large" color={theme.colors.purple} />
        <Text style={styles.loadingText}>Loading details...</Text>
      </View>
    );
  }

  if (error || !detail) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#FF7F00" />
        <Icon name="alert-triangle" size={48} color={theme.colors.danger} />
        <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
        <Text style={styles.errorSubTitle}>{error || 'Request detail is unavailable'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchDetails}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isRejected = detail.isDeleted === true || record?.rawItem?.isDeleted === true || record?.status === 'Rejected';
  const isApproved = !isRejected && (detail.isPosted === true || record?.status === 'Approved');
  const isPending = !isApproved && !isRejected;
  const formattedAmount = `PKR ${Number(detail.amount).toLocaleString()}`;

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
          <Text style={styles.pageSubtitle}>{`Request #${detail.expID}`}</Text>
        </View>
      </View>

      {/* HeroCard Component */}
      <View style={styles.floatingHeroContainer}>
        <HeroCard
          colors={[theme.colors.white, theme.colors.white]} // Solid white background override
          topLabel="Total Amount"
          topLabelStyle={{ color: theme.colors.textMuted }}
          topIcon=""
          title={formattedAmount}
          titleStyle={styles.customHeroTitle}
          rightElement={
            <View style={[
              styles.statusBadge,
              {
                backgroundColor: isApproved
                  ? theme.colors.successSubtle
                  : isRejected
                    ? theme.colors.dangerSubtle
                    : theme.colors.pendingChipBg
              }
            ]}>
              <Text style={[
                styles.statusBadgeText,
                {
                  color: isApproved
                    ? theme.colors.successStrong
                    : isRejected
                      ? theme.colors.dangerStrong
                      : theme.colors.pendingChipText
                }
              ]}>
                {isApproved ? 'Approved' : isRejected ? 'Rejected' : 'Pending'}
              </Text>
            </View>
          }
        >
          <View style={styles.amountBottom}>
            <Icon name="info" size={14} color={theme.colors.textMuted} style={{ marginRight: 8 }} />
            <Text style={styles.dateText}>
              {isApproved ? 'Status: Approved' : isRejected ? 'Status: Rejected' : 'Status: Pending Review'}
            </Text>
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
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>School</Text>
              <Text style={styles.infoValue} numberOfLines={2}>{detail.schoolName}</Text>
            </View>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 }]}>
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.purpleSurface }]}>
              <Icon name="file-text" size={18} color={theme.colors.accentPurple} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Category Name</Text>
              <Text style={styles.infoValue} numberOfLines={2}>{detail.expName || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descText}>{detail.expDesc || 'No description provided'}</Text>
        </View>

      </ScrollView>

      {/* Bottom Action Bar (Approve/Reject) */}
      {!isApproved && !isRejected && role === 'coordinator' && (
        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <TouchableOpacity
            style={[styles.rejectBtn, isOperating && { opacity: 0.6 }]}
            activeOpacity={0.8}
            onPress={() => handleAction('delete')}
            disabled={isOperating}
          >
            {isOperating ? (
              <ActivityIndicator color={theme.colors.dangerStrong} size="small" />
            ) : (
              <>
                <Icon name="x" size={18} color={theme.colors.dangerStrong} style={{ marginRight: 6 }} />
                <Text style={styles.rejectBtnText}>Reject</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.approveBtn, isOperating && { opacity: 0.6 }]}
            activeOpacity={0.8}
            onPress={() => handleAction('Insert')}
            disabled={isOperating}
          >
            {isOperating ? (
              <ActivityIndicator color={theme.colors.white} size="small" />
            ) : (
              <>
                <Icon name="check" size={18} color={theme.colors.white} style={{ marginRight: 6 }} />
                <Text style={styles.approveBtnText}>Approve</Text>
              </>
            )}
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.backgroundLight,
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
    backgroundColor: theme.colors.backgroundLight,
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