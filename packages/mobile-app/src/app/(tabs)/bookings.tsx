import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { bookingsApi } from '../../services/bookings.api';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { colors, typography, spacing, borderRadius } from '../../theme';

const STATUS_TABS = [
  { key: '', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'accepted', label: 'Upcoming' },
  { key: 'in_progress', label: 'Active' },
  { key: 'completed', label: 'Completed' },
];

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  pending: { color: colors.warning, bg: colors.warningBg },
  accepted: { color: colors.info, bg: colors.infoBg },
  in_progress: { color: '#8B5CF6', bg: '#EDE9FE' },
  completed: { color: colors.success, bg: colors.successBg },
  rejected: { color: colors.error, bg: colors.errorBg },
  cancelled: { color: colors.gray[500], bg: colors.gray[100] },
};

export default function BookingsScreen() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState('');

  const bookingsQuery = useQuery({
    queryKey: ['bookings', statusFilter],
    queryFn: () => bookingsApi.getAll({ status: statusFilter || undefined }),
  });

  const bookings = bookingsQuery.data?.data || [];

  const renderBooking = ({ item }: { item: any }) => {
    const statusStyle = STATUS_COLORS[item.status] || STATUS_COLORS.pending;

    return (
      <TouchableOpacity
        style={styles.bookingCard}
        onPress={() => router.push(`/booking/${item.id}`)}
        activeOpacity={0.7}
      >
        <View style={styles.bookingHeader}>
          <View style={styles.bookingServiceRow}>
            <Text style={styles.bookingServiceName} numberOfLines={1}>
              {item.service?.name}
            </Text>
            <Badge
              label={item.status.replace('_', ' ').toUpperCase()}
              color={statusStyle.color}
              backgroundColor={statusStyle.bg}
            />
          </View>
          <Text style={styles.bookingId}>#{item.id}</Text>
        </View>

        <View style={styles.bookingBody}>
          {item.provider && (
            <View style={styles.providerRow}>
              <Avatar uri={item.provider?.user?.avatar} name={item.provider?.user?.name} size={36} />
              <Text style={styles.providerName}>{item.provider?.user?.name}</Text>
            </View>
          )}

          <View style={styles.bookingDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={16} color={colors.gray[400]} />
              <Text style={styles.detailText}>{item.scheduledDate}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={16} color={colors.gray[400]} />
              <Text style={styles.detailText}>{item.scheduledTime}</Text>
            </View>
          </View>
        </View>

        <View style={styles.bookingFooter}>
          <Text style={styles.bookingPrice}>${item.totalPrice}</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.gray[400]} />
        </View>
      </TouchableOpacity>
    );
  };

  if (bookingsQuery.isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      {/* Status Filter Tabs */}
      <FlatList
        horizontal
        data={STATUS_TABS}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.tab, statusFilter === item.key && styles.tabActive]}
            onPress={() => setStatusFilter(item.key)}
          >
            <Text style={[styles.tabText, statusFilter === item.key && styles.tabTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Bookings List */}
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderBooking}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={bookingsQuery.isRefetching}
            onRefresh={() => bookingsQuery.refetch()}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="calendar-outline"
            title="No bookings yet"
            subtitle="Book a service to see it here"
            actionLabel="Browse Services"
            onAction={() => router.push('/(tabs)/home')}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  tabsContainer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  tab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    ...typography.smallMedium,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.white,
  },
  listContent: {
    padding: spacing.xl,
    gap: spacing.md,
    flexGrow: 1,
  },
  bookingCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  bookingHeader: {
    marginBottom: spacing.md,
  },
  bookingServiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingServiceName: {
    ...typography.bodyMedium,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  bookingId: {
    ...typography.caption,
    color: colors.textLight,
    marginTop: 2,
  },
  bookingBody: {
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    paddingTop: spacing.md,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  providerName: {
    ...typography.smallMedium,
    color: colors.gray[700],
  },
  bookingDetails: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    ...typography.small,
    color: colors.textSecondary,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    paddingTop: spacing.md,
    marginTop: spacing.md,
  },
  bookingPrice: {
    ...typography.h4,
    color: colors.primary,
  },
});
