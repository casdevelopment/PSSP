import React, { useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import RoleCard from '../../components/RoleCard';
import PrimaryButton from '../../components/PrimaryButton';
import { theme } from '../../theme/theme';
import { useAuthStore } from '../../store/AuthStore';

export default function Role() {
  const demoLogin = useAuthStore((state) => state.demoLogin);
  const [selectedRole, setSelectedRole] = useState('');

  const handleContinue = () => {
    demoLogin(selectedRole);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <LinearGradient
            colors={['#155DFC', '#9810FA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.logoBox, theme.shadow.card]}
          >
            <Image source={require('../../assets/icons/degree-icon.png')} style={styles.logoIcon} />
          </LinearGradient>
          <Text style={styles.title}>School Manager</Text>
          <Text style={styles.subtitle}>Select your role to continue</Text>
        </View>

        <View style={styles.rolesContainer}>
          <RoleCard
            title="Coordinator"
            description="Super Admin"
            icon={require('../../assets/icons/crown-icon.png')}
            iconBgColor={theme.gradients.purple}
            isSelected={selectedRole === 'coordinator'}
            onPress={() => setSelectedRole('coordinator')}
          />
          <RoleCard
            title="Principal"
            description="School Admin"
            icon={require('../../assets/icons/degree-icon.png')}
            iconBgColor={theme.colors.linkPrimary}
            isSelected={selectedRole === 'principal'}
            onPress={() => setSelectedRole('principal')}
          />
          <RoleCard
            title="Staff"
            description="Teacher"
            icon={require('../../assets/icons/profile-icon.png')}
            iconBgColor={theme.gradients.green[0]}
            isSelected={selectedRole === 'staff'}
            onPress={() => setSelectedRole('staff')}
          />
        </View>

        <View style={styles.footer}>
          <PrimaryButton 
            title="Continue" 
            onPress={handleContinue} 
            showChevron={false} 
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FC', // matches light image bg
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    tintColor: theme.colors.white,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.textHeading,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  rolesContainer: {
    flex: 1,
  },
  footer: {
    paddingBottom: 40,
  }
});