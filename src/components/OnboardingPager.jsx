import React, { useRef, useState } from 'react'
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native'
import OnboardingSlide from './OnboardingSlide'
import PagerDots from './PagerDots'
import PrimaryButton from './PrimaryButton'
import { theme } from '../theme/theme'

const { width } = Dimensions.get('window')

export default function OnboardingPager({ slides = [], onFinish }) {
  const ref = useRef(null)
  const [index, setIndex] = useState(0)

  function handleNext() {
    if (index === slides.length - 1) {
      onFinish && onFinish()
    } else {
      ref.current?.scrollToIndex({ index: index + 1 })
      setIndex((i) => i + 1)
    }
  }

  function handleSkip() {
    ref.current?.scrollToIndex({ index: slides.length - 1 })
    setIndex(slides.length - 1)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={ref}
        data={slides}
        keyExtractor={(item, i) => item.id || String(i)}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={{ width }}>
            <OnboardingSlide {...item} />
          </View>
        )}
      />

      <View style={styles.footer}>
        <PagerDots length={slides.length} index={index} />
        <PrimaryButton
          title={index === slides.length - 1 ? slides[index].buttonLabel || 'Get Started' : 'Next'}
          onPress={handleNext}
          style={styles.button}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.appBackground,
  },
  skipButton: {
    position: 'absolute',
    right: theme.spacing.xl,
    top: theme.spacing.md,
    zIndex: 10,
  },
  skipText: {
    color: theme.colors.textMuted,
    fontSize: 16,
  },
  footer: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: theme.spacing.lg,
    alignSelf: 'center',
    width: '92%',
  },
})
