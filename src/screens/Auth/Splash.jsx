import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../../theme/theme';

// const { width, height } = Dimensions.get('window');

const Splash = ({ navigation }) => {
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem(
          'hasSeenOnboarding',
        );
        console.log('Onboarding status:', hasSeenOnboarding);
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
    <LinearGradient
      colors={theme.gradients.purple}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Blurred background decorative element */}
      <View style={styles.blurredContainer} />

      {/* Main content */}
      <View style={styles.contentContainer}>
        {/* Logo box */}
        <View style={styles.iconBox}>
          <Image
            source={require('../../assets/icons/degree-icon.png')}
            style={styles.logoImage}
          />
        </View>

        {/* Text container */}
        <View style={styles.textContainer}>
          <Text style={styles.heading}>Unique Education</Text>
          <Text style={styles.subheading}>Society</Text>
        </View>
      </View>
    </LinearGradient>
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
    backgroundColor: theme.colors.purple,
    borderWidth: 1.38,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  logoImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  heading: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Outfit',
    letterSpacing: -0.75,
    textAlign: 'center',
  },
  subheading: {
    fontSize: theme.spacing.md,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Manrope',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
})