import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';

const AttendanceOption = ({ label, type, isSelected, onPress }) => {
  const getColors = () => {
    switch (type) {
      case 'Present':
        return {
          activeBg: '#10B981', activeText: '#FFF',
          inactiveBg: '#ECFDF5', inactiveText: '#10B981'
        };
      case 'Late':
        return {
          activeBg: '#EA580C', activeText: '#FFF',
          inactiveBg: '#FFF7ED', inactiveText: '#EA580C' 
        };
      case 'Absent':
        return {
          activeBg: '#E11D48', activeText: '#FFF',
          inactiveBg: '#FEF2F2', inactiveText: '#E11D48'
        };
      default:
        return { activeBg: '#000', activeText: '#FFF', inactiveBg: '#EEE', inactiveText: '#000' };
    }
  };

  const colors = getColors();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.optionBtn,
        { backgroundColor: isSelected ? colors.activeBg : colors.inactiveBg }
      ]}
    >
      <Text style={[
        styles.optionText,
        { color: isSelected ? colors.activeText : colors.inactiveText }
      ]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default function AttendanceCard({ person, onStatusChange }) {
  return (
    <View style={styles.card}>
      <View style={styles.infoRow}>
        <Text style={styles.name}>{person.name}</Text>
        <Text style={styles.subtitle}>{person.subtitle}</Text>
      </View>
      <View style={styles.optionsRow}>
        <AttendanceOption 
          label="Present" 
          type="Present" 
          isSelected={person.status === 'Present'} 
          onPress={() => onStatusChange(person.id, 'Present')} 
        />
        <AttendanceOption 
          label="Late" 
          type="Late" 
          isSelected={person.status === 'Late'} 
          onPress={() => onStatusChange(person.id, 'Late')} 
        />
        <AttendanceOption 
          label="Absent" 
          type="Absent" 
          isSelected={person.status === 'Absent'} 
          onPress={() => onStatusChange(person.id, 'Absent')} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  infoRow: {
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textHeading,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textMuted,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: -4,
    marginRight: -4,
  },
  optionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
