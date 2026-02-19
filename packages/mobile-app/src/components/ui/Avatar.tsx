import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../theme';

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ uri, name, size = 48 }) => {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : '?';

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
      />
    );
  }

  return (
    <View
      style={[
        styles.placeholder,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text style={[styles.initials, { fontSize: size * 0.38 }]}>{initials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.gray[200],
  },
  placeholder: {
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    ...typography.bodySemibold,
    color: colors.primary,
  },
});
