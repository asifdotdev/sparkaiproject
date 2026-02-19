import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { categoriesApi } from '../../services/categories.api';
import { servicesApi } from '../../services/services.api';
import { providersApi } from '../../services/providers.api';
import { notificationsApi } from '../../services/notifications.api';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { colors, typography, spacing, borderRadius } from '../../theme';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  const servicesQuery = useQuery({
    queryKey: ['services', 'popular'],
    queryFn: () => servicesApi.getAll({ limit: 6 }),
  });

  const providersQuery = useQuery({
    queryKey: ['providers', 'top'],
    queryFn: () => providersApi.getAll({ limit: 5 }),
  });

  const categories = categoriesQuery.data?.data || [];
  const services = servicesQuery.data?.data || [];
  const providers = providersQuery.data?.data || [];

  const unreadQuery = useQuery({
    queryKey: ['notifications-unread'],
    queryFn: () => notificationsApi.getUnreadCount(),
    enabled: !!user,
  });
  const unreadCount = unreadQuery.data?.data?.count || 0;

  const isRefreshing = categoriesQuery.isRefetching;

  const onRefresh = () => {
    categoriesQuery.refetch();
    servicesQuery.refetch();
    providersQuery.refetch();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'there'} 👋</Text>
            <Text style={styles.tagline}>What service do you need?</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.searchIcon}>
              <Ionicons name="notifications-outline" size={24} color={colors.gray[600]} />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/search')} style={styles.searchIcon}>
              <Ionicons name="search" size={24} color={colors.gray[600]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <TouchableOpacity style={styles.searchBar} onPress={() => router.push('/search')}>
          <Ionicons name="search-outline" size={20} color={colors.gray[400]} />
          <Text style={styles.searchPlaceholder}>Search for services...</Text>
        </TouchableOpacity>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat: any) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryItem}
                onPress={() => router.push(`/category/${cat.id}`)}
              >
                <View style={styles.categoryIcon}>
                  {cat.image ? (
                    <Image source={{ uri: cat.image }} style={styles.categoryImage} />
                  ) : (
                    <Ionicons name="construct-outline" size={28} color={colors.primary} />
                  )}
                </View>
                <Text style={styles.categoryName} numberOfLines={2}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Services</Text>
            <TouchableOpacity onPress={() => router.push('/search')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
            {services.map((service: any) => (
              <Card
                key={service.id}
                variant="elevated"
                onPress={() => router.push(`/service/${service.id}`)}
                style={styles.serviceCard}
              >
                {service.image && (
                  <Image source={{ uri: service.image }} style={styles.serviceImage} />
                )}
                <Text style={styles.serviceName} numberOfLines={1}>{service.name}</Text>
                <Text style={styles.serviceCategory} numberOfLines={1}>
                  {service.category?.name}
                </Text>
                <View style={styles.serviceFooter}>
                  <Text style={styles.servicePrice}>${service.price}</Text>
                  <Text style={styles.serviceDuration}>{service.durationMinutes} min</Text>
                </View>
              </Card>
            ))}
          </ScrollView>
        </View>

        {/* Top Providers */}
        <View style={[styles.section, { marginBottom: spacing['3xl'] }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Providers</Text>
          </View>
          {providers.map((provider: any) => (
            <Card
              key={provider.id}
              variant="outlined"
              onPress={() => router.push(`/provider/${provider.id}`)}
              style={styles.providerCard}
            >
              <View style={styles.providerRow}>
                <Avatar uri={provider.user?.avatar} name={provider.user?.name} size={52} />
                <View style={styles.providerInfo}>
                  <Text style={styles.providerName}>{provider.user?.name}</Text>
                  <View style={styles.providerMeta}>
                    <Ionicons name="star" size={14} color={colors.warning} />
                    <Text style={styles.providerRating}>{provider.rating}</Text>
                    <Text style={styles.providerJobs}>• {provider.totalJobs} jobs</Text>
                  </View>
                </View>
                {provider.verified && (
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                  </View>
                )}
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  greeting: {
    ...typography.h3,
    color: colors.text,
  },
  tagline: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  searchIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    marginHorizontal: spacing.xl,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  searchPlaceholder: {
    ...typography.body,
    color: colors.placeholder,
  },
  section: {
    marginTop: spacing['2xl'],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  seeAll: {
    ...typography.smallMedium,
    color: colors.primary,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  categoryItem: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  categoryImage: {
    width: 60,
    height: 60,
  },
  categoryName: {
    ...typography.captionMedium,
    color: colors.gray[700],
    textAlign: 'center',
  },
  horizontalList: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  serviceCard: {
    width: 180,
    padding: 0,
    overflow: 'hidden',
  },
  serviceImage: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
  },
  serviceName: {
    ...typography.smallMedium,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  serviceCategory: {
    ...typography.caption,
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
    marginTop: 2,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    marginTop: spacing.sm,
  },
  servicePrice: {
    ...typography.bodySemibold,
    color: colors.primary,
  },
  serviceDuration: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  providerCard: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  providerName: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  providerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  providerRating: {
    ...typography.smallMedium,
    color: colors.gray[700],
  },
  providerJobs: {
    ...typography.small,
    color: colors.textSecondary,
  },
  verifiedBadge: {
    marginLeft: spacing.sm,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
});
