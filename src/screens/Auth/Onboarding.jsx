import React from 'react'
import { View } from 'react-native'
import OnboardingPager from '../../components/OnboardingPager'
import { theme } from '../../theme/theme'
import { SafeAreaView } from "react-native-safe-area-context";

const slides = [
  {
    id: 's1',
    icon: '👥',
    title: 'Manage Everything',
    description:
      'Complete education management system for students, staff, and academics in one place.',
    iconBg: theme.colors.statPurple,
    buttonLabel: 'Next',
  },
  {
    id: 's2',
    icon: '📅',
    title: 'Stay Organized',
    description:
      'Track attendance, manage timetables, and handle all academic activities effortlessly.',
    iconBg: theme.colors.statOrange,
    buttonLabel: 'Next',
  },
  {
    id: 's3',
    icon: '📈',
    title: 'Insights & Reports',
    description:
      'Get detailed analytics and reports to make informed decisions for better education.',
    iconBg: theme.colors.statGreen,
    buttonLabel: 'Get Started',
  },
]

export default function Onboarding() {

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.appBackground }}>
      <OnboardingPager slides={slides} onFinish={() => {}} />
    </SafeAreaView>
  )
}