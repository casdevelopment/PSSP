import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme/theme';

const schoolsData = [
  { id: '1', name: 'Greenwood High', students: 450, staff: 32 },
  { id: '2', name: 'Riverside Academy', students: 380, staff: 28 },
  { id: '3', name: 'Maple Valley School', students: 520, staff: 38 },
];

const RecentSchools = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Schools</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.list}>
        {schoolsData.map((item, index) => (
          <TouchableOpacity 
            key={item.id} 
            style={[
              styles.itemContainer, 
              index === schoolsData.length - 1 ? null : styles.itemMargin 
            ]}
            activeOpacity={0.7}
          >
            <View style={styles.textContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.details}>{item.students} students • {item.staff} staff</Text>
            </View>
            <Icon name="chevron-right" size={20} color={theme.colors.textMuted} />
          </TouchableOpacity>
        ))}
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
});

export default RecentSchools;
