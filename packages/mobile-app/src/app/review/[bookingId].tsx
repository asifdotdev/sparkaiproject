import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { reviewsApi } from '../../services/reviews.api';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { colors, typography, spacing, borderRadius } from '../../theme';

export default function WriteReviewScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const reviewMutation = useMutation({
    mutationFn: () => reviewsApi.create({ bookingId: parseInt(bookingId), rating, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
      Alert.alert('Thank you!', 'Your review has been submitted.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.error?.message || 'Failed to submit review');
    },
  });

  return (
    <>
      <Stack.Screen options={{ title: 'Write Review' }} />
      <View style={styles.container}>
        <Text style={styles.title}>How was your experience?</Text>
        <Text style={styles.subtitle}>Your feedback helps us improve our services</Text>

        {/* Star Rating */}
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)} activeOpacity={0.7}>
              <Ionicons
                name={star <= rating ? 'star' : 'star-outline'}
                size={44}
                color={star <= rating ? colors.warning : colors.gray[300]}
              />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.ratingLabel}>
          {rating === 0 && 'Tap to rate'}
          {rating === 1 && 'Poor'}
          {rating === 2 && 'Fair'}
          {rating === 3 && 'Good'}
          {rating === 4 && 'Very Good'}
          {rating === 5 && 'Excellent'}
        </Text>

        {/* Comment */}
        <Input
          label="Comment (Optional)"
          placeholder="Tell us more about your experience..."
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={4}
          style={{ height: 120, textAlignVertical: 'top' }}
        />

        <Button
          title="Submit Review"
          onPress={() => reviewMutation.mutate()}
          loading={reviewMutation.isPending}
          disabled={rating === 0}
          size="lg"
          style={styles.submitButton}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface, padding: spacing.xl, paddingTop: spacing['3xl'] },
  title: { ...typography.h2, color: colors.text, textAlign: 'center' },
  subtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing['3xl'],
  },
  ratingLabel: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing['2xl'],
  },
  submitButton: { marginTop: spacing.xl },
});
