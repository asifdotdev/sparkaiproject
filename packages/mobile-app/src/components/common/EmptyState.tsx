import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'file-tray-outline',
  title,
  subtitle,
  actionLabel,
  onAction,
}) => (
  <View style={styles.container}>
    <Ionicons name={icon} size={64} color={colors.gray[300]} />
    <Text style={styles.title}>{title}</Text>
    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    {actionLabel && onAction && (
      <Button title={actionLabel} onPress={onAction} variant="outline" size="sm" style={styles.button} />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['3xl'],
  },
  title: {
    ...typography.h4,
    color: colors.gray[700],
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  button: {
    marginTop: spacing.xl,
  },
});
