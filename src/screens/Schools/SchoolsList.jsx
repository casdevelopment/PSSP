import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';
import { useAuthStore } from '../../store/AuthStore';
import { getEmployeeSchoolDashboardDetails } from '../../network/apis';

// Components
import HeroCard from '../../components/HeroCard';

export default function SchoolsList() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const empId = useAuthStore((state) => state.empId);
  const [schoolsList, setSchoolsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (empId) {
      setIsLoading(true);
      getEmployeeSchoolDashboardDetails(empId)
        .then((res) => {
          if (res && res.success) {
            setSchoolsList(res.data || []);
          } else {
            setSchoolsList([]);
          }
        })
        .catch((err) => {
          console.error('Error fetching employee school details:', err);
          setSchoolsList([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [empId]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.backgroundLight} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Custom Hero Card for Schools */}
        <View style={styles.heroWrapper}>
          <HeroCard
            topLabel="Total Schools"
            title={schoolsList.length.toString()}
            subtitle="Assigned schools"
            colors={theme.gradients.purple}
          />
        </View>

        {/* Schools List */}
        <View style={styles.listContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color={theme.colors.purple} style={{ marginTop: 40 }} />
          ) : schoolsList.length === 0 ? (
            <View style={styles.centered}>
              <Icon name="home" size={48} color={theme.colors.textMuted} style={styles.emptyIcon} />
              <Text style={styles.emptyText}>No schools assigned</Text>
            </View>
          ) : (
            schoolsList.map((school, index) => {
              const uniqueId = school.schoolIdFk || index;
              const locationStr = school.locationAddress || school.locationName || 'N/A';
              return (
                <TouchableOpacity
                  key={uniqueId}
                  style={styles.schoolCard}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('SchoolDetail', { school })}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.schoolName}>{school.schoolName || 'Unknown'}</Text>
                    <Icon name="chevron-right" size={20} color={theme.colors.textMuted} />
                  </View>

                  <View style={styles.locationRow}>
                    <Icon name="map-pin" size={14} color={theme.colors.textBody} style={{ marginRight: 6 }} />
                    <Text style={styles.locationText} numberOfLines={1}>{locationStr}</Text>
                  </View>

                  <View style={styles.statsRow}>
                    <View style={[styles.statBox, { backgroundColor: theme.colors.blueSurface }]}>
                      <View style={styles.statTop}>
                        <Icon name="users" size={12} color={theme.colors.linkPrimary} style={{ marginRight: 4 }} />
                        <Text style={[styles.statLabel, { color: theme.colors.linkPrimary }]}>Students</Text>
                      </View>
                      <Text style={[styles.statValue, { color: theme.colors.linkPrimary }]}>{school.totalStudent || 0}</Text>
                    </View>

                    <View style={[styles.statBox, { backgroundColor: theme.colors.greenSurface }]}>
                      <View style={styles.statTop}>
                        <Icon name="user-check" size={12} color={theme.colors.successStrong} style={{ marginRight: 4 }} />
                        <Text style={[styles.statLabel, { color: theme.colors.successStrong }]}>Staff</Text>
                      </View>
                      <Text style={[styles.statValue, { color: theme.colors.successStrong }]}>{school.schoolEmployees || 0}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
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
    gap: 16,
    paddingHorizontal: 16,
  },
  schoolCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  schoolName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textHeading,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationText: {
    fontSize: 14,
    color: theme.colors.textBody,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statBox: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  statTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
});