import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RoleCard from '../../components/RoleCard';
import { theme } from '../../theme/theme';
import { useAuthStore } from '../../store/AuthStore';

export default function Role() {
  const demoLogin = useAuthStore((state) => state.demoLogin);

  const handleRoleSelect = (role) => {
    // In a real app we might pass the selected role to demoLogin or setAuth
    demoLogin();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Select Your Role</Text>
          <Text style={styles.subtitle}>Choose how you want to continue</Text>
        </View>

        <View style={styles.rolesContainer}>
          <RoleCard
            title="Principal"
            description="Full access to all modules and administration"
            icon={require('../../assets/icons/crown-icon.png')}
            iconBgColor={theme.gradients.purple}
            onPress={() => handleRoleSelect('principal')}
          />
          <RoleCard
            title="Staff"
            description="Access to teaching and class management"
            icon={require('../../assets/icons/profile-icon.png')}
            iconBgColor={theme.gradients.orange}
            onPress={() => handleRoleSelect('staff')}
          />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Your access level is determined by your account type. Contact the administrator if you need to change your role.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.appBackground,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.textHeading,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textMuted,
  },
  rolesContainer: {
    flex: 1,
  },
  infoBox: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    marginBottom: theme.spacing.xl,
  },
  infoText: {
    fontSize: 13,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});