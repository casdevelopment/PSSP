import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';

const AttendanceOption = ({ label, type, isSelected, onPress, disabled }) => {
  const getColors = () => {
    switch (type) {
      case 'Present':
        return {
          activeBg: '#10B981', activeText: '#FFF',
          inactiveBg: '#ECFDF5', inactiveText: '#10B981'
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
      activeOpacity={disabled ? 1 : 0.7}
      onPress={disabled ? null : onPress}
      style={[
        styles.optionBtn,
        { backgroundColor: isSelected ? colors.activeBg : colors.inactiveBg },
        disabled && { opacity: isSelected ? 0.9 : 0.4 }
      ]}
    >
      <Text style={[
        styles.optionText,
        { color: isSelected ? colors.activeText : colors.inactiveText }
      ]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default function AttendanceCard({ person, onStatusChange, disabled }) {
  React.useEffect(() => {
    if (!person.status && !disabled && onStatusChange) {
      onStatusChange(person.id, 'Present');
    }
  }, [person.id, person.status, disabled, onStatusChange]);

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
          isSelected={person.status === 'Present' || (!person.status && !disabled)}
          onPress={() => onStatusChange(person.id, 'Present')}
          disabled={disabled}
        />
        <AttendanceOption
          label="Absent"
          type="Absent"
          isSelected={person.status === 'Absent'}
          onPress={() => onStatusChange(person.id, 'Absent')}
          disabled={disabled}
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
