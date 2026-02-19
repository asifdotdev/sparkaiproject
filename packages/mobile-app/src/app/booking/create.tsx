import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { servicesApi } from '../../services/services.api';
import { bookingsApi } from '../../services/bookings.api';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { colors, typography, spacing, borderRadius } from '../../theme';

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
];

export default function CreateBookingScreen() {
  const { serviceId, providerId } = useLocalSearchParams<{ serviceId: string; providerId?: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const serviceQuery = useQuery({
    queryKey: ['service', serviceId],
    queryFn: () => servicesApi.getById(parseInt(serviceId)),
  });

  const bookingMutation = useMutation({
    mutationFn: () =>
      bookingsApi.create({
        serviceId: parseInt(serviceId),
        providerId: providerId ? parseInt(providerId) : undefined,
        scheduledDate: selectedDate,
        scheduledTime: selectedTime,
        address,
        notes: notes || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      router.push('/booking/success');
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.error?.message || 'Failed to create booking');
    },
  });

  const service = serviceQuery.data?.data;

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return {
      full: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate().toString(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
    };
  });

  const canSubmit = selectedDate && selectedTime && address.length >= 5;

  if (serviceQuery.isLoading) return <LoadingScreen />;

  return (
    <>
      <Stack.Screen options={{ title: 'Book Service' }} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Service Summary */}
        <View style={styles.serviceSummary}>
          <Text style={styles.serviceName}>{service?.name}</Text>
          <View style={styles.serviceDetails}>
            <Text style={styles.servicePrice}>${service?.price}</Text>
            <Text style={styles.serviceDuration}>• {service?.durationMinutes} min</Text>
          </View>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
            {dates.map((d) => (
              <TouchableOpacity
                key={d.full}
                style={[styles.dateCard, selectedDate === d.full && styles.dateCardActive]}
                onPress={() => setSelectedDate(d.full)}
              >
                <Text style={[styles.dateDay, selectedDate === d.full && styles.dateTextActive]}>{d.day}</Text>
                <Text style={[styles.dateNum, selectedDate === d.full && styles.dateTextActive]}>{d.date}</Text>
                <Text style={[styles.dateMonth, selectedDate === d.full && styles.dateTextActive]}>{d.month}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time</Text>
          <View style={styles.timeGrid}>
            {TIME_SLOTS.map((time) => (
              <TouchableOpacity
                key={time}
                style={[styles.timeChip, selectedTime === time && styles.timeChipActive]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[styles.timeText, selectedTime === time && styles.timeTextActive]}>{time}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Address</Text>
          <Input
            placeholder="Enter your full address"
            value={address}
            onChangeText={setAddress}
            leftIcon="location-outline"
            multiline
          />
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Notes (Optional)</Text>
          <Input
            placeholder="Any special instructions..."
            value={notes}
            onChangeText={setNotes}
            leftIcon="chatbubble-outline"
            multiline
          />
        </View>

        {/* Price Summary */}
        <View style={styles.priceSummary}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service Charge</Text>
            <Text style={styles.priceValue}>${service?.price}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${service?.price}</Text>
          </View>
        </View>

        <Button
          title="Confirm Booking"
          onPress={() => bookingMutation.mutate()}
          loading={bookingMutation.isPending}
          disabled={!canSubmit}
          size="lg"
          style={styles.confirmButton}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.xl },
  serviceSummary: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  serviceName: { ...typography.h4, color: colors.text },
  serviceDetails: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 4 },
  servicePrice: { ...typography.bodySemibold, color: colors.primary },
  serviceDuration: { ...typography.small, color: colors.textSecondary },
  section: { marginBottom: spacing.xl },
  sectionTitle: { ...typography.bodyMedium, color: colors.text, marginBottom: spacing.md },
  dateRow: { gap: spacing.sm },
  dateCard: {
    width: 70,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateCardActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dateDay: { ...typography.captionMedium, color: colors.textSecondary },
  dateNum: { ...typography.h3, color: colors.text, marginVertical: 2 },
  dateMonth: { ...typography.caption, color: colors.textSecondary },
  dateTextActive: { color: colors.white },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  timeChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  timeText: { ...typography.smallMedium, color: colors.text },
  timeTextActive: { color: colors.white },
  priceSummary: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
  },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  priceLabel: { ...typography.body, color: colors.textSecondary },
  priceValue: { ...typography.body, color: colors.text },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  totalLabel: { ...typography.bodySemibold, color: colors.text },
  totalValue: { ...typography.h4, color: colors.primary },
  confirmButton: { marginBottom: spacing['4xl'] },
});
