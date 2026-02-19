import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { colors, typography, spacing } from '../theme';

export default function WelcomeScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated]);

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>⚡</Text>
        </View>
        <Text style={styles.title}>SparkAI</Text>
        <Text style={styles.subtitle}>Services</Text>
        <Text style={styles.description}>
          Book trusted professionals for home services. From cleaning to repairs, we've got you covered.
        </Text>
      </View>

      <View style={styles.features}>
        {[
          { icon: '🏠', text: 'Expert home services' },
          { icon: '📅', text: 'Easy online booking' },
          { icon: '⭐', text: 'Verified professionals' },
        ].map((feature, i) => (
          <View key={i} style={styles.featureRow}>
            <Text style={styles.featureIcon}>{feature.icon}</Text>
            <Text style={styles.featureText}>{feature.text}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <Button
          title="Get Started"
          onPress={() => router.push('/auth/register')}
          size="lg"
          style={styles.button}
        />
        <Button
          title="Already have an account? Log in"
          onPress={() => router.push('/auth/login')}
          variant="ghost"
          size="md"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing['2xl'],
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: 40,
  },
  hero: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    ...typography.h1,
    color: colors.primary,
    fontSize: 36,
  },
  subtitle: {
    ...typography.h2,
    color: colors.gray[600],
    marginBottom: spacing.lg,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.xl,
  },
  features: {
    gap: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.gray[50],
    padding: spacing.lg,
    borderRadius: 14,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureText: {
    ...typography.bodyMedium,
    color: colors.gray[700],
  },
  actions: {
    gap: spacing.sm,
  },
  button: {
    width: '100%',
  },
});
