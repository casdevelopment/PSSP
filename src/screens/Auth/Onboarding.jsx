import React from 'react'
import { View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingPager from '../../components/OnboardingPager'
import { theme } from '../../theme/theme'
import { SafeAreaView } from "react-native-safe-area-context";

const slides = [
  {
    id: 's1',
    icon: require('../../assets/icons/people-icon.png'),
    title: 'Manage Everything',
    description:
      'Complete education management system for students, staff, and academics in one place.',
    iconBg: theme.gradients.purple,
    buttonLabel: 'Next',
  },
  {
    id: 's2',
    icon: require('../../assets/icons/calander-icon.png'),
    title: 'Stay Organized',
    description:
      'Track attendance, manage timetables, and handle all academic activities effortlessly.',
    iconBg: theme.gradients.orange,
    buttonLabel: 'Next',
  },
  {
    id: 's3',
    icon: require('../../assets/icons/insight-icon.png'),
    title: 'Insights & Reports',
    description:
      'Get detailed analytics and reports to make informed decisions for better education.',
    iconBg: theme.gradients.green,
    buttonLabel: 'Get Started',
  },
]

export default function Onboarding({ navigation }) {

  const handleFinish = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    } catch (e) {
      console.log('Error setting hasSeenOnboarding:', e);
    }
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.appBackground }}>
      <OnboardingPager slides={slides} onFinish={handleFinish} />
    </SafeAreaView>
  )
}