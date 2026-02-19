import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { servicesApi } from '../../services/services.api';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { colors, typography, spacing, borderRadius } from '../../theme';

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['service', id],
    queryFn: () => servicesApi.getById(parseInt(id)),
  });

  const service = data?.data;
  const providers = service?.providers || [];

  if (isLoading) return <LoadingScreen />;
  if (!service) return null;

  return (
    <>
      <Stack.Screen options={{ title: service.name }} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {service.image && <Image source={{ uri: service.image }} style={styles.heroImage} />}

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{service.category?.name}</Text>
            </View>
            <Text style={styles.title}>{service.name}</Text>
            <Text style={styles.description}>{service.description}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="cash-outline" size={22} color={colors.primary} />
              <Text style={styles.infoLabel}>Price</Text>
              <Text style={styles.infoValue}>${service.price}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={22} color={colors.primary} />
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>{service.durationMinutes} min</Text>
            </View>
          </View>

          {/* Providers */}
          {providers.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Available Providers</Text>
              {providers.map((provider: any) => (
                <TouchableOpacity
                  key={provider.id}
                  style={styles.providerCard}
                  onPress={() => router.push(`/provider/${provider.id}`)}
                >
                  <Avatar uri={provider.user?.avatar} name={provider.user?.name} size={48} />
                  <View style={styles.providerInfo}>
                    <Text style={styles.providerName}>{provider.user?.name}</Text>
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={14} color={colors.warning} />
                      <Text style={styles.rating}>{provider.rating}</Text>
                      <Text style={styles.jobs}>({provider.totalJobs} jobs)</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.selectButton}
                    onPress={() =>
                      router.push({
                        pathname: '/booking/create',
                        params: { serviceId: id, providerId: provider.id.toString() },
                      })
                    }
                  >
                    <Text style={styles.selectText}>Select</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomPrice}>${service.price}</Text>
          <Text style={styles.bottomDuration}>{service.durationMinutes} min service</Text>
        </View>
        <Button
          title="Book Now"
          onPress={() => router.push({ pathname: '/booking/create', params: { serviceId: id } })}
          style={styles.bookButton}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  heroImage: { width: '100%', height: 220 },
  content: { padding: spacing.xl },
  header: { marginBottom: spacing.xl },
  categoryBadge: {
    backgroundColor: colors.primaryBg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  categoryText: { ...typography.captionMedium, color: colors.primary },
  title: { ...typography.h2, color: colors.text },
  description: { ...typography.body, color: colors.textSecondary, marginTop: spacing.sm, lineHeight: 24 },
  infoRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  infoItem: { flex: 1, alignItems: 'center' },
  infoDivider: { width: 1, backgroundColor: colors.border },
  infoLabel: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
  infoValue: { ...typography.h4, color: colors.text, marginTop: 2 },
  section: { marginTop: spacing['2xl'] },
  sectionTitle: { ...typography.h4, color: colors.text, marginBottom: spacing.md },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  providerInfo: { flex: 1, marginLeft: spacing.md },
  providerName: { ...typography.bodyMedium, color: colors.text },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  rating: { ...typography.smallMedium, color: colors.gray[700] },
  jobs: { ...typography.caption, color: colors.textSecondary },
  selectButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primaryBg,
    borderRadius: borderRadius.md,
  },
  selectText: { ...typography.smallMedium, color: colors.primary },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.xl,
    paddingBottom: spacing['3xl'],
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bottomPrice: { ...typography.h3, color: colors.text },
  bottomDuration: { ...typography.caption, color: colors.textSecondary },
  bookButton: { paddingHorizontal: spacing['3xl'] },
});
