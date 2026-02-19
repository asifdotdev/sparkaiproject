import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { Avatar } from '../../components/ui/Avatar';
import { colors, typography, spacing, borderRadius } from '../../theme';

const MENU_ITEMS = [
  { icon: 'person-outline' as const, label: 'Edit Profile', route: '/edit-profile' },
  { icon: 'card-outline' as const, label: 'Payment Methods', route: null },
  { icon: 'location-outline' as const, label: 'Saved Addresses', route: null },
  { icon: 'notifications-outline' as const, label: 'Notifications', route: null },
  { icon: 'help-circle-outline' as const, label: 'Help & Support', route: null },
  { icon: 'information-circle-outline' as const, label: 'About', route: null },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Avatar uri={user?.avatar} name={user?.name} size={80} />
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user?.role?.toUpperCase()}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>$0</Text>
            <Text style={styles.statLabel}>Spent</Text>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menu}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => item.route && router.push(item.route as any)}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconBg}>
                  <Ionicons name={item.icon} size={20} color={colors.primary} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.gray[400]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.version}>SparkAI Services v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    backgroundColor: colors.surface,
  },
  name: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.md,
  },
  email: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  roleBadge: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primaryBg,
    borderRadius: borderRadius.full,
  },
  roleText: {
    ...typography.captionMedium,
    color: colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginTop: 1,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing['2xl'],
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h3,
    color: colors.text,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  menu: {
    backgroundColor: colors.surface,
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  menuIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    ...typography.body,
    color: colors.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.xl,
    paddingVertical: spacing.lg,
    marginHorizontal: spacing.xl,
    backgroundColor: colors.errorBg,
    borderRadius: borderRadius.lg,
  },
  logoutText: {
    ...typography.bodySemibold,
    color: colors.error,
  },
  version: {
    ...typography.caption,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing['3xl'],
  },
});
