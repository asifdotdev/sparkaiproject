import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, borderRadius, spacing } from '../../theme';

interface BadgeProps {
  label: string;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  color = colors.primary,
  backgroundColor = colors.primaryBg,
  style,
}) => {
  return (
    <View style={[styles.badge, { backgroundColor }, style]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.captionMedium,
  },
});
