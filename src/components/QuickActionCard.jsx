import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function QuickActionCard({ title, bgColor, textColor, onPress }) {
  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: bgColor }]} onPress={onPress}>
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      <Icon name="chevron-right" size={20} color={textColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
});
