import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme/theme';

export default function SearchFilter({ value, onChangeText, placeholder = 'Search school...' }) {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchWrapper}>
        <Icon name="search" size={20} color={theme.colors.textMuted} style={styles.searchIcon} />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textMuted}
          style={styles.searchInput}
          value={value}
          onChangeText={onChangeText}
        />
        {value ? (
          <TouchableOpacity onPress={() => onChangeText('')}>
            <Icon name="x" size={18} color={theme.colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop: 4,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.textHeading,
    paddingVertical: 0,
  },
});
