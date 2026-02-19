import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { providersApi } from '../../services/providers.api';
import { Avatar } from '../../components/ui/Avatar';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { colors, typography, spacing, borderRadius } from '../../theme';

export default function ProviderProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['provider', id],
    queryFn: () => providersApi.getById(parseInt(id)),
  });

  const provider = data?.data;

  if (isLoading) return <LoadingScreen />;
  if (!provider) return null;

  const reviews = provider.reviews || [];
  const services = provider.services || [];

  return (
    <>
      <Stack.Screen options={{ title: provider.user?.name || 'Provider' }} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Avatar uri={provider.user?.avatar} name={provider.user?.name} size={90} />
          <Text style={styles.name}>{provider.user?.name}</Text>
          {provider.verified && (
            <View style={styles.verifiedRow}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text style={styles.verifiedText}>Verified Provider</Text>
            </View>
          )}
          {provider.bio && <Text style={styles.bio}>{provider.bio}</Text>}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <View style={styles.statIcon}>
              <Ionicons name="star" size={20} color={colors.warning} />
            </View>
            <Text style={styles.statValue}>{provider.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.stat}>
            <View style={styles.statIcon}>
              <Ionicons name="briefcase" size={20} color={colors.info} />
            </View>
            <Text style={styles.statValue}>{provider.totalJobs}</Text>
            <Text style={styles.statLabel}>Jobs</Text>
          </View>
          <View style={styles.stat}>
            <View style={styles.statIcon}>
              <Ionicons name="time" size={20} color={colors.success} />
            </View>
            <Text style={styles.statValue}>{provider.experienceYears}y</Text>
            <Text style={styles.statLabel}>Exp</Text>
          </View>
        </View>

        {/* Services */}
        {services.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Services Offered</Text>
            {services.map((service: any) => (
              <Card
                key={service.id}
                variant="outlined"
                onPress={() => router.push(`/service/${service.id}`)}
                style={styles.serviceCard}
              >
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.servicePrice}>${service.price}</Text>
              </Card>
            ))}
          </View>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <View style={[styles.section, { marginBottom: spacing['4xl'] }]}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            {reviews.map((review: any) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Avatar uri={review.user?.avatar} name={review.user?.name} size={36} />
                  <View style={styles.reviewInfo}>
                    <Text style={styles.reviewerName}>{review.user?.name}</Text>
                    <View style={styles.starsRow}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Ionicons
                          key={i}
                          name={i < review.rating ? 'star' : 'star-outline'}
                          size={14}
                          color={colors.warning}
                        />
                      ))}
                    </View>
                  </View>
                </View>
                {review.comment && <Text style={styles.reviewComment}>{review.comment}</Text>}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing['2xl'],
    paddingHorizontal: spacing.xl,
  },
  name: { ...typography.h2, color: colors.text, marginTop: spacing.md },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xs,
  },
  verifiedText: { ...typography.smallMedium, color: colors.success },
  bio: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.md },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    marginTop: 1,
    paddingVertical: spacing.xl,
  },
  stat: { alignItems: 'center' },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.gray[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  statValue: { ...typography.h4, color: colors.text },
  statLabel: { ...typography.caption, color: colors.textSecondary },
  section: { padding: spacing.xl },
  sectionTitle: { ...typography.h4, color: colors.text, marginBottom: spacing.md },
  serviceCard: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  serviceName: { ...typography.bodyMedium, color: colors.text },
  servicePrice: { ...typography.bodySemibold, color: colors.primary },
  reviewCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  reviewInfo: { flex: 1 },
  reviewerName: { ...typography.smallMedium, color: colors.text },
  starsRow: { flexDirection: 'row', gap: 2, marginTop: 2 },
  reviewComment: { ...typography.small, color: colors.textSecondary, marginTop: spacing.sm },
});
