import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../../theme/theme';
import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';
import { loginUser } from '../../network/apis';
import { useAuthStore } from '../../store/AuthStore';
import ForgotPasswordModel from '../../components/ForgotPasswordModel';

export default function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isForgotVisible, setIsForgotVisible] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSignIn = async () => {
    const trimmedUserName = userName.trim().toLowerCase();

    if (!trimmedUserName || !password) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    setErrorMessage('');

    try {
      setIsSubmitting(true);
      const response = await loginUser({
        userName: trimmedUserName,
        password,
        fcmToken: 'string',
      });

      if (response?.success === false) {
        throw new Error(response?.message || 'Login failed.');
      }

      const authData = response?.data ?? {};
      console.log('auth data -> ', authData);
      const role = String(authData.userType ?? '').trim().toLowerCase();
      const accessToken = authData.token ?? authData.accessToken ?? null;
      const schoolId = authData.schoolId ?? null;
      setAuth(
        trimmedUserName,
        accessToken,
        schoolId,
        authData.empId ?? null,
        authData.userId ?? null,
        authData.userType.trim().toLowerCase() ?? null,
        authData.image ?? null,
        authData.schoolCount ?? null,
        authData.phoneNo ?? null,
        authData.email ?? null,
      );
    }
    catch (error) {
      console.error('Login error:', error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Please try again!';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={theme.gradients.purple}
            style={[styles.logoBox, theme.shadow.card]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Image source={require('../../assets/icons/degree-icon.png')} style={styles.logoIcon} />
          </LinearGradient>
          <View style={styles.headerTextWrapper}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <CustomInput
            label="Username"
            iconName="mail"
            placeholder="sa"
            autoCapitalize="none"
            value={userName}
            onChangeText={setUserName}
          />

          <CustomInput
            label="Password"
            iconName="lock"
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.forgotBtn} onPress={() => setIsForgotVisible(true)}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>


        {!!errorMessage && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}

        {/* Action Buttons */}
        <PrimaryButton
          title="Sign In"
          onPress={handleSignIn}
          showChevron={false}
          style={styles.signInBtnWrapper}
          loading={isSubmitting}
        />

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity style={styles.faceIdBtn}>
          <Text style={styles.faceIdBtnText}>Sign in with Face ID</Text>
        </TouchableOpacity>

      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity>
          <Text style={styles.contactAdminText}>Contact Admin</Text>
        </TouchableOpacity>
      </View>

      <ForgotPasswordModel
        visible={isForgotVisible}
        onClose={() => setIsForgotVisible(false)}
      />
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 40,
  },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  logoIcon: {
    width: 38,
    height: 38,
    resizeMode: 'contain',
    tintColor: theme.colors.white,
  },
  headerTextWrapper: {
    flex: 1,
  },
  title: {
    fontSize: theme.spacing.xl,
    fontWeight: '800',
    color: '#0A0A0A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: theme.spacing.sm,
    color: theme.colors.textMuted,
  },
  formContainer: {
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textHeading,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 52,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.textStrong,
  },
  eyeBtn: {
    padding: 8,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: -8,
  },
  forgotText: {
    color: theme.colors.purple,
    fontSize: theme.spacing.sm,
    fontWeight: '500',
  },
  signInBtnWrapper: {
    marginBottom: 24,
    width: '100%',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '500',
    marginTop: -8,
    marginBottom: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.borderSubtle,
  },
  dividerText: {
    marginHorizontal: 16,
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  faceIdBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceIdBtnText: {
    color: theme.colors.textHeading,
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: theme.spacing.xl,
  },
  footerText: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  contactAdminText: {
    color: theme.colors.purple,
    fontSize: 14,
    fontWeight: '500',
  },
});
