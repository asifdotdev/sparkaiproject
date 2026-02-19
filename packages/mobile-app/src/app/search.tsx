import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { servicesApi } from '../services/services.api';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/common/EmptyState';
import { colors, typography, spacing, borderRadius } from '../theme';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => servicesApi.search(query),
    enabled: query.length >= 2,
  });

  const results = data?.data || [];

  return (
    <>
      <Stack.Screen options={{ title: 'Search' }} />
      <View style={styles.container}>
        <Input
          placeholder="Search for services..."
          value={query}
          onChangeText={setQuery}
          leftIcon="search-outline"
          autoFocus
        />

        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultCard}
              onPress={() => router.push(`/service/${item.id}`)}
              activeOpacity={0.7}
            >
              {item.image && <Image source={{ uri: item.image }} style={styles.resultImage} />}
              <View style={styles.resultInfo}>
                <Text style={styles.resultName}>{item.name}</Text>
                <Text style={styles.resultCategory}>{item.category?.name}</Text>
                <Text style={styles.resultPrice}>${item.price}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.gray[400]} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            query.length >= 2 && !isLoading ? (
              <EmptyState icon="search-outline" title="No results found" subtitle="Try a different search term" />
            ) : query.length < 2 ? (
              <EmptyState icon="search-outline" title="Search Services" subtitle="Type at least 2 characters to search" />
            ) : null
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.xl },
  list: { flexGrow: 1, gap: spacing.sm, marginTop: spacing.sm },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultImage: { width: 56, height: 56, borderRadius: borderRadius.md },
  resultInfo: { flex: 1, marginLeft: spacing.md },
  resultName: { ...typography.bodyMedium, color: colors.text },
  resultCategory: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  resultPrice: { ...typography.smallMedium, color: colors.primary, marginTop: 2 },
});
