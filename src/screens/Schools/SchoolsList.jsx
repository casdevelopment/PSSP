import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';

// Components
import HeroCard from '../../components/HeroCard';

const SCHOOLS_DATA = [
  { id: '1', name: 'Greenwood High School', location: 'Downtown', students: '450', staff: '32', score: '92%' },
  { id: '2', name: 'Riverside Academy', location: 'North District', students: '380', staff: '28', score: '88%' },
  { id: '3', name: 'Maple Valley School', location: 'East Side', students: '520', staff: '38', score: '95%' },
  { id: '4', name: 'Sunset Elementary', location: 'West End', students: '310', staff: '24', score: '90%' },
  { id: '5', name: 'Oakwood Institute', location: 'South Hills', students: '420', staff: '30', score: '87%' },
  { id: '6', name: 'Pine Ridge School', location: 'Central', students: '390', staff: '29', score: '91%' },
];

export default function SchoolsList() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.backgroundLight} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Custom Hero Card for Schools */}
        <View style={styles.heroWrapper}>
          <HeroCard
            topLabel="Total Schools"
            title="6"
            subtitle="Across 5 districts"
            colors={theme.gradients.purple}
          />
        </View>

        {/* Schools List */}
        <View style={styles.listContainer}>
          {SCHOOLS_DATA.map((school) => (
            <TouchableOpacity 
              key={school.id} 
              style={styles.schoolCard}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('SchoolDetail', { school })}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.schoolName}>{school.name}</Text>
                <Icon name="chevron-right" size={20} color={theme.colors.textMuted} />
              </View>
              
              <View style={styles.locationRow}>
                <Icon name="map-pin" size={14} color={theme.colors.textBody} style={{ marginRight: 6 }} />
                <Text style={styles.locationText}>{school.location}</Text>
              </View>

              <View style={styles.statsRow}>
                <View style={[styles.statBox, { backgroundColor: theme.colors.blueSurface }]}>
                  <View style={styles.statTop}>
                    <Icon name="users" size={12} color={theme.colors.linkPrimary} style={{ marginRight: 4 }} />
                    <Text style={[styles.statLabel, { color: theme.colors.linkPrimary }]}>Students</Text>
                  </View>
                  <Text style={[styles.statValue, { color: theme.colors.linkPrimary }]}>{school.students}</Text>
                </View>

                <View style={[styles.statBox, { backgroundColor: theme.colors.greenSurface }]}>
                  <View style={styles.statTop}>
                    <Icon name="user-check" size={12} color={theme.colors.successStrong} style={{ marginRight: 4 }} />
                    <Text style={[styles.statLabel, { color: theme.colors.successStrong }]}>Staff</Text>
                  </View>
                  <Text style={[styles.statValue, { color: theme.colors.successStrong }]}>{school.staff}</Text>
                </View>

                <View style={[styles.statBox, { backgroundColor: theme.colors.purpleSurface }]}>
                  <View style={styles.statTop}>
                    <Text style={[styles.statLabel, { color: theme.colors.accentPurple }]}>Score</Text>
                  </View>
                  <Text style={[styles.statValue, { color: theme.colors.accentPurple }]}>{school.score}</Text>
                </View>
              </View>
            </TouchableOpacity>
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
});