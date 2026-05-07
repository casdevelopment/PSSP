import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SvgUri } from 'react-native-svg';
import {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const { width, height } = Dimensions.get('window');

const Splash = ({ navigation }) => {
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem(
          'hasSeenOnboarding',
        );
        setTimeout(() => {
          if (hasSeenOnboarding === null) {
            navigation.replace('Onboarding'); // first time → show onboarding
          } else {
            navigation.replace('Login'); // already seen → go to login
          }
        }, 2000); // keep your splash delay
      } catch (e) {
        console.log('Error checking onboarding:', e);
        navigation.replace('Login');
      }
    };

    checkOnboarding();
  }, [navigation]);
  
  return (
    <View style={styles.container}>
      {/* Blurred background decorative element */}
      <View style={styles.blurredContainer} />

      {/* Main content */}
      <View style={styles.contentContainer}>
        {/* Logo box */}
        <View style={styles.iconBox}>
          {/* <SvgUri
            width="100%"
            height="100%"
            uri={require('../../assets/icons/Icon.svg')}
          /> */}
        </View>

        {/* Text container */}
        <View style={styles.textContainer}>
          <Text style={styles.heading}>Unique Education</Text>
          <Text style={styles.subheading}>Society</Text>
        </View>
      </View>
    </View>
  )
}

export default Splash

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  contentContainer: {
    width: 229,
    height: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    gap: 12,
  },
    iconBox: {
    width: 95,
    height: 95,
    backgroundColor: 'white',
    borderWidth: 1.38,
    borderColor: 'rgba(255, 255, 255)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  heading: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Outfit',
    letterSpacing: -0.75,
    lineHeight: 36,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Manrope',
    letterSpacing: 0.4,
    lineHeight: 24,
    textAlign: 'center',
  },
})