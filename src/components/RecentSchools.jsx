import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme/theme';
import { useAuthStore } from '../store/AuthStore';
import { getEmployeeSchoolDashboardDetails } from '../network/apis';

const RecentSchools = () => {
  const navigation = useNavigation();
  const empId = useAuthStore((state) => state.empId);

  const [schools, setSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (empId) {
      setIsLoading(true);
      getEmployeeSchoolDashboardDetails(empId)
        .then((res) => {
          if (res && res.success) {
            // Display only recent/first 3 schools on the dashboard
            setSchools((res.data || []).slice(0, 3));
          } else {
            setSchools([]);
          }
        })
        .catch((err) => {
          console.error('Error fetching recent schools:', err);
          setSchools([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [empId]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Schools</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Schools')}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.list}>
        {isLoading ? (
          <ActivityIndicator size="small" color={theme.colors.purple} style={{ padding: 20 }} />
        ) : schools.length === 0 ? (
          <Text style={styles.emptyText}>No assigned schools found</Text>
        ) : (
          schools.map((school, index) => {
            const uniqueId = school.schoolIdFk || index;
            const studentsCount = school.totalStudent || 0;
            const staffCount = school.schoolEmployees || 0;

            return (
              <TouchableOpacity 
                key={uniqueId} 
                style={[
                  styles.itemContainer, 
                  index === schools.length - 1 ? null : styles.itemMargin 
                ]}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('SchoolDetail', { school })}
              >
                <View style={styles.textContainer}>
                  <Text style={styles.name}>{school.schoolName || 'Unknown School'}</Text>
                  <Text style={styles.details}>{studentsCount} students • {staffCount} staff</Text>
                </View>
                <Icon name="chevron-right" size={20} color={theme.colors.textMuted} />
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textHeading,
  },
  viewAll: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.linkPrimary,
  },
  list: {
    flexDirection: 'column',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.appBackground,
    padding: 16,
    borderRadius: 16,
  },
  itemMargin: {
    marginBottom: 12,
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
    color: theme.colors.textHeading,
    marginBottom: 4,
  },
  details: {
    fontSize: 15,
    color: theme.colors.textMuted,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.textMuted,
    fontSize: 15,
    paddingVertical: 12,
  },
});

export default RecentSchools;
