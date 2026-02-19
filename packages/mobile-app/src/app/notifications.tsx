import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { notificationsApi } from '../services/notifications.api';
import { LoadingScreen } from '../components/common/LoadingScreen';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/ui/Button';
import { colors, typography, spacing, borderRadius } from '../theme';

const NOTIFICATION_ICONS: Record<string, { name: string; color: string; bg: string }> = {
  booking_created: { name: 'calendar-outline', color: colors.info, bg: colors.infoBg },
  booking_accepted: { name: 'checkmark-circle-outline', color: colors.success, bg: colors.successBg },
  booking_rejected: { name: 'close-circle-outline', color: colors.error, bg: colors.errorBg },
  booking_started: { name: 'play-circle-outline', color: '#8B5CF6', bg: '#EDE9FE' },
  booking_completed: { name: 'trophy-outline', color: colors.success, bg: colors.successBg },
  booking_cancelled: { name: 'ban-outline', color: colors.gray[500], bg: colors.gray[100] },
  payment_received: { name: 'cash-outline', color: colors.success, bg: colors.successBg },
  review_received: { name: 'star-outline', color: colors.warning, bg: colors.warningBg },
  general: { name: 'notifications-outline', color: colors.primary, bg: colors.primaryBg },
};

export default function NotificationsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.getAll({ limit: 50 }),
  });

  const markAllMutation = useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread'] });
    },
  });

  const markOneMutation = useMutation({
    mutationFn: (id: number) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread'] });
    },
  });

  const notifications = data?.data || [];

  const handleNotificationPress = (notification: any) => {
    if (!notification.isRead) {
      markOneMutation.mutate(notification.id);
    }
    // Navigate to relevant screen based on type
    if (notification.referenceId && notification.type.startsWith('booking_')) {
      router.push(`/booking/${notification.referenceId}`);
    }
    if (notification.type === 'payment_received' && notification.referenceId) {
      router.push(`/booking/${notification.referenceId}`);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const renderNotification = ({ item }: { item: any }) => {
    const iconConfig = NOTIFICATION_ICONS[item.type] || NOTIFICATION_ICONS.general;
    return (
      <TouchableOpacity
        style={[styles.notificationCard, !item.isRead && styles.unreadCard]}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconCircle, { backgroundColor: iconConfig.bg }]}>
          <Ionicons name={iconConfig.name as any} size={22} color={iconConfig.color} />
        </View>
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, !item.isRead && styles.unreadTitle]} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.time}>{formatTime(item.createdAt)}</Text>
          </View>
          <Text style={styles.body} numberOfLines={2}>{item.body}</Text>
        </View>
        {!item.isRead && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Notifications',
          headerRight: () =>
            notifications.length > 0 ? (
              <TouchableOpacity onPress={() => markAllMutation.mutate()} style={{ marginRight: spacing.sm }}>
                <Text style={{ ...typography.smallMedium, color: colors.primary }}>Mark all read</Text>
              </TouchableOpacity>
            ) : null,
        }}
      />
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNotification}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="notifications-off-outline"
            title="No Notifications"
            subtitle="You're all caught up! New notifications will appear here."
          />
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg, gap: spacing.sm, flexGrow: 1 },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  unreadCard: { backgroundColor: colors.primaryBg, borderColor: colors.primaryLight + '40' },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1, marginLeft: spacing.md },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { ...typography.bodyMedium, color: colors.text, flex: 1 },
  unreadTitle: { fontWeight: '700' },
  time: { ...typography.caption, color: colors.textLight, marginLeft: spacing.sm },
  body: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginLeft: spacing.sm,
  },
});
