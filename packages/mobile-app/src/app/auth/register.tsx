import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../services/auth.api';
import { useAuthStore } from '../../store/authStore';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { colors, typography, spacing, borderRadius } from '../../theme';

export default function RegisterScreen() {
  const router = useRouter();
  const { setUser, setTokens } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'provider'>('user');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const registerMutation = useMutation({
    mutationFn: () => authApi.register({ name, email, phone, password, role }),
    onSuccess: async (response) => {
      const { user, accessToken, refreshToken } = response.data;
      await setTokens(accessToken, refreshToken);
      setUser(user);
      router.replace('/(tabs)/home');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Registration failed';
      const details = error.response?.data?.error?.details;
      if (details) {
        setErrors(Object.fromEntries(Object.entries(details).map(([k, v]: any) => [k, v[0]])));
      } else {
        setErrors({ email: message });
      }
    },
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name || name.length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!email) newErrors.email = 'Email is required';
    if (!password || password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (validate()) {
      registerMutation.mutate();
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Join SparkAI and start booking services</Text>
        </View>

        <View style={styles.roleToggle}>
          <TouchableOpacity
            style={[styles.roleButton, role === 'user' && styles.roleActive]}
            onPress={() => setRole('user')}
          >
            <Text style={[styles.roleText, role === 'user' && styles.roleTextActive]}>Customer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === 'provider' && styles.roleActive]}
            onPress={() => setRole('provider')}
          >
            <Text style={[styles.roleText, role === 'provider' && styles.roleTextActive]}>Service Provider</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            leftIcon="person-outline"
            error={errors.name}
          />
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
            label="Phone (Optional)"
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            leftIcon="call-outline"
            error={errors.phone}
          />
          <Input
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            isPassword
            leftIcon="lock-closed-outline"
            error={errors.password}
          />

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={registerMutation.isPending}
            size="lg"
            style={styles.button}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text style={styles.link}> Sign In</Text>
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
    paddingTop: 80,
    paddingBottom: spacing['3xl'],
  },
  header: {
    marginBottom: spacing['2xl'],
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
  roleToggle: {
    flexDirection: 'row',
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.lg,
    padding: 4,
    marginBottom: spacing['2xl'],
  },
  roleButton: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  roleActive: {
    backgroundColor: colors.surface,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  roleText: {
    ...typography.smallMedium,
    color: colors.textSecondary,
  },
  roleTextActive: {
    color: colors.primary,
    fontWeight: '600',
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
