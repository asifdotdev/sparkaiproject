import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';
import { colors, typography, spacing } from '../../theme';

export default function BookingSuccessScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle" size={80} color={colors.success} />
      </View>
      <Text style={styles.title}>Booking Confirmed!</Text>
      <Text style={styles.subtitle}>
        Your service has been booked successfully. You'll receive a notification when a provider accepts your request.
      </Text>

      <View style={styles.actions}>
        <Button
          title="View My Bookings"
          onPress={() => router.replace('/(tabs)/bookings')}
          size="lg"
          style={styles.button}
        />
        <Button
          title="Back to Home"
          onPress={() => router.replace('/(tabs)/home')}
          variant="outline"
          size="lg"
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['3xl'],
  },
  iconContainer: {
    marginBottom: spacing['2xl'],
  },
  title: {
    ...typography.h1,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 24,
  },
  actions: {
    width: '100%',
    marginTop: spacing['4xl'],
    gap: spacing.md,
  },
  button: {
    width: '100%',
  },
});
