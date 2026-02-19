import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '../../services/categories.api';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { colors, typography, spacing, borderRadius } from '../../theme';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['category', id],
    queryFn: () => categoriesApi.getById(parseInt(id)),
  });

  const category = data?.data;
  const services = category?.services || [];

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <Stack.Screen options={{ title: category?.name || 'Category' }} />
      <FlatList
        data={services}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/service/${item.id}`)}
            activeOpacity={0.7}
          >
            {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
              <View style={styles.footer}>
                <Text style={styles.price}>${item.price}</Text>
                <Text style={styles.duration}>{item.durationMinutes} min</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.xl, gap: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  image: { width: 100, height: 100 },
  info: { flex: 1, padding: spacing.md },
  name: { ...typography.bodyMedium, color: colors.text },
  description: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  price: { ...typography.bodySemibold, color: colors.primary },
  duration: { ...typography.caption, color: colors.textSecondary },
});
