import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { bookingsApi } from '../../services/bookings.api';
import { useAuthStore } from '../../store/authStore';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { colors, typography, spacing, borderRadius } from '../../theme';

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  pending: { color: colors.warning, bg: colors.warningBg },
  accepted: { color: colors.info, bg: colors.infoBg },
  in_progress: { color: '#8B5CF6', bg: '#EDE9FE' },
  completed: { color: colors.success, bg: colors.successBg },
  rejected: { color: colors.error, bg: colors.errorBg },
  cancelled: { color: colors.gray[500], bg: colors.gray[100] },
};

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingsApi.getById(parseInt(id)),
  });

  const cancelMutation = useMutation({
    mutationFn: () => bookingsApi.cancel(parseInt(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  const acceptMutation = useMutation({
    mutationFn: () => bookingsApi.accept(parseInt(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  const startMutation = useMutation({
    mutationFn: () => bookingsApi.start(parseInt(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
    },
  });

  const completeMutation = useMutation({
    mutationFn: () => bookingsApi.complete(parseInt(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
    },
  });

  const booking = data?.data;
  if (isLoading) return <LoadingScreen />;
  if (!booking) return null;

  const statusStyle = STATUS_COLORS[booking.status] || STATUS_COLORS.pending;
  const isProvider = user?.role === 'provider';

  const handleCancel = () => {
    Alert.alert('Cancel Booking', 'Are you sure you want to cancel this booking?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes, Cancel', style: 'destructive', onPress: () => cancelMutation.mutate() },
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ title: `Booking #${booking.id}` }} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Status */}
        <View style={[styles.statusCard, { backgroundColor: statusStyle.bg }]}>
          <Badge
            label={booking.status.replace('_', ' ').toUpperCase()}
            color={statusStyle.color}
            backgroundColor="transparent"
          />
          <Text style={[styles.statusMessage, { color: statusStyle.color }]}>
            {booking.status === 'pending' && 'Waiting for provider to accept'}
            {booking.status === 'accepted' && 'Provider has accepted your booking'}
            {booking.status === 'in_progress' && 'Service is being performed'}
            {booking.status === 'completed' && 'Service completed successfully'}
            {booking.status === 'cancelled' && 'This booking was cancelled'}
            {booking.status === 'rejected' && 'This booking was rejected'}
          </Text>
        </View>

        {/* Service Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Service</Text>
          <Text style={styles.serviceName}>{booking.service?.name}</Text>
          <View style={styles.detailRow}>
            <Ionicons name="cash-outline" size={16} color={colors.gray[400]} />
            <Text style={styles.detailText}>${booking.totalPrice}</Text>
          </View>
        </View>

        {/* Date & Time */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Schedule</Text>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color={colors.gray[400]} />
            <Text style={styles.detailText}>{booking.scheduledDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={16} color={colors.gray[400]} />
            <Text style={styles.detailText}>{booking.scheduledTime}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color={colors.gray[400]} />
            <Text style={styles.detailText}>{booking.address}</Text>
          </View>
        </View>

        {/* Provider Info */}
        {booking.provider && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Provider</Text>
            <View style={styles.providerRow}>
              <Avatar uri={booking.provider?.user?.avatar} name={booking.provider?.user?.name} size={48} />
              <View style={{ marginLeft: spacing.md }}>
                <Text style={styles.providerName}>{booking.provider?.user?.name}</Text>
                <Text style={styles.providerPhone}>{booking.provider?.user?.phone}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Notes */}
        {booking.notes && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Notes</Text>
            <Text style={styles.detailText}>{booking.notes}</Text>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          {/* User actions */}
          {!isProvider && booking.status === 'pending' && (
            <Button title="Cancel Booking" onPress={handleCancel} variant="outline" size="lg" loading={cancelMutation.isPending} />
          )}
          {!isProvider && booking.status === 'completed' && !booking.review && (
            <Button title="Write Review" onPress={() => router.push(`/review/${booking.id}`)} size="lg" />
          )}

          {/* Provider actions */}
          {isProvider && booking.status === 'pending' && (
            <View style={styles.providerActions}>
              <Button title="Accept" onPress={() => acceptMutation.mutate()} size="lg" style={{ flex: 1 }} loading={acceptMutation.isPending} />
              <Button title="Reject" onPress={handleCancel} variant="outline" size="lg" style={{ flex: 1 }} />
            </View>
          )}
          {isProvider && booking.status === 'accepted' && (
            <Button title="Start Service" onPress={() => startMutation.mutate()} size="lg" loading={startMutation.isPending} />
          )}
          {isProvider && booking.status === 'in_progress' && (
            <Button title="Complete Service" onPress={() => completeMutation.mutate()} size="lg" loading={completeMutation.isPending} />
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.xl },
  statusCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  statusMessage: { ...typography.small, marginTop: spacing.xs },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { ...typography.captionMedium, color: colors.textSecondary, marginBottom: spacing.sm, textTransform: 'uppercase' },
  serviceName: { ...typography.h4, color: colors.text, marginBottom: spacing.sm },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
  detailText: { ...typography.body, color: colors.gray[700] },
  providerRow: { flexDirection: 'row', alignItems: 'center' },
  providerName: { ...typography.bodyMedium, color: colors.text },
  providerPhone: { ...typography.small, color: colors.textSecondary },
  actions: { marginTop: spacing.lg, marginBottom: spacing['4xl'] },
  providerActions: { flexDirection: 'row', gap: spacing.md },
});
