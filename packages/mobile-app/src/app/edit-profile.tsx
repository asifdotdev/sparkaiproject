import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { userApi } from '../services/user.api';
import { useAuthStore } from '../store/authStore';
import { Avatar } from '../components/ui/Avatar';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { colors, typography, spacing } from '../theme';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState('');

  const updateMutation = useMutation({
    mutationFn: () => userApi.updateProfile({ name, phone, address: address || undefined }),
    onSuccess: () => {
      setUser({ ...user!, name, phone });
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.error?.message || 'Failed to update profile');
    },
  });

  return (
    <>
      <Stack.Screen options={{ title: 'Edit Profile' }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          <Avatar uri={user?.avatar} name={user?.name} size={90} />
          <Text style={styles.changePhoto}>Change Photo</Text>
        </View>

        <Input
          label="Full Name"
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
          leftIcon="person-outline"
        />
        <Input
          label="Email"
          value={user?.email || ''}
          editable={false}
          leftIcon="mail-outline"
          style={{ color: colors.textSecondary }}
        />
        <Input
          label="Phone"
          placeholder="Enter your phone number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          leftIcon="call-outline"
        />
        <Input
          label="Address"
          placeholder="Enter your address"
          value={address}
          onChangeText={setAddress}
          leftIcon="location-outline"
          multiline
        />

        <Button
          title="Save Changes"
          onPress={() => updateMutation.mutate()}
          loading={updateMutation.isPending}
          size="lg"
          style={styles.saveButton}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing.xl },
  avatarSection: { alignItems: 'center', marginBottom: spacing['2xl'] },
  changePhoto: { ...typography.smallMedium, color: colors.primary, marginTop: spacing.md },
  saveButton: { marginTop: spacing.lg },
});
