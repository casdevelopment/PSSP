import React from 'react'
import { View, StyleSheet } from 'react-native'
import { theme } from '../theme/theme'

export default function PagerDots({ length = 3, index = 0 }) {
  return (
    <View style={styles.row}>
      {Array.from({ length }).map((_, i) => (
        <View
          key={i}
          style={[
            i === index ? styles.pillActive : styles.dotInactive,
          ]}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotInactive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: theme.colors.borderSubtle,
  },
  pillActive: {
    width: 36,
    height: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: theme.colors.statPurple,
  },
})
