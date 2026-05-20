import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme/theme';

export default function HeaderPlusButton({ onPress }) {
  return (
    <TouchableOpacity
      style={{ marginRight: 16 }}
      onPress={onPress}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: theme.colors.linkPrimary,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name="plus" size={24} color="#FFF" />
      </View>
    </TouchableOpacity>
  );
}