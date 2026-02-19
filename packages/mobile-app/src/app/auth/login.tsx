import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../services/auth.api';
import { useAuthStore } from '../../store/authStore';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { colors, typography, spacing } from '../../theme';

export default function LoginScreen() {
  const router = useRouter();
  const { setUser, setTokens } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const loginMutation = useMutation({
    mutationFn: () => authApi.login(email, password),
    onSuccess: async (response) => {
      const { user, accessToken, refreshToken } = response.data;
      await setTokens(accessToken, refreshToken);
      setUser(user);
      router.replace('/(tabs)/home');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Login failed';
      setErrors({ email: message });
    },
  });

  const validate = () => {
    const newErrors: any = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validate()) {
      loginMutation.mutate();
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to continue booking services</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
            error={errors.email}
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            isPassword
            leftIcon="lock-closed-outline"
            error={errors.password}
          />

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loginMutation.isPending}
            size="lg"
            style={styles.button}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/auth/register')}>
            <Text style={styles.link}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.surface },
  container: {
    flexGrow: 1,
    paddingHorizontal: spacing['2xl'],
    paddingTop: 100,
    paddingBottom: spacing['3xl'],
  },
  header: {
    marginBottom: spacing['4xl'],
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  form: {
    flex: 1,
  },
  button: {
    marginTop: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing['2xl'],
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  link: {
    ...typography.bodySemibold,
    color: colors.primary,
  },
});
