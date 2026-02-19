import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { paymentsApi } from '../../services/payments.api';
import { Button } from '../../components/ui/Button';
import { colors, typography, spacing, borderRadius } from '../../theme';

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: 'card-outline' as const, description: 'Visa, Mastercard, Amex' },
  { id: 'upi', label: 'UPI', icon: 'phone-portrait-outline' as const, description: 'Google Pay, PhonePe, Paytm' },
  { id: 'wallet', label: 'Wallet', icon: 'wallet-outline' as const, description: 'SparkAI Wallet Balance' },
  { id: 'net_banking', label: 'Net Banking', icon: 'globe-outline' as const, description: 'All major banks supported' },
  { id: 'cash', label: 'Cash on Service', icon: 'cash-outline' as const, description: 'Pay after service completion' },
];

type PaymentStep = 'select' | 'processing' | 'result';

export default function PaymentScreen() {
  const { bookingId, amount } = useLocalSearchParams<{ bookingId: string; amount: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedMethod, setSelectedMethod] = useState('card');
  const [step, setStep] = useState<PaymentStep>('select');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const initiateMutation = useMutation({
    mutationFn: () => paymentsApi.initiate(parseInt(bookingId), selectedMethod),
  });

  const confirmMutation = useMutation({
    mutationFn: (gatewayOrderId?: string) => paymentsApi.confirm(parseInt(bookingId), gatewayOrderId),
  });

  const handlePay = async () => {
    try {
      setStep('processing');

      // Step 1: Initiate payment
      const initResult = await initiateMutation.mutateAsync();
      const gatewayOrderId = initResult?.data?.gatewayOrderId;

      // Simulate gateway processing delay (1.5-3 seconds)
      await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1500));

      // Step 2: Confirm payment
      const confirmResult = await confirmMutation.mutateAsync(gatewayOrderId);
      const success = confirmResult?.data?.success ?? true;

      setPaymentSuccess(success);
      setStep('result');

      // Refresh booking data
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    } catch (error: any) {
      setPaymentSuccess(false);
      setStep('result');
    }
  };

  if (step === 'processing') {
    return (
      <>
        <Stack.Screen options={{ title: 'Processing Payment', headerLeft: () => null }} />
        <View style={styles.centerContainer}>
          <View style={styles.processingCard}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.processingTitle}>Processing Payment</Text>
            <Text style={styles.processingSubtitle}>
              {selectedMethod === 'cash' ? 'Confirming cash payment...' : 'Connecting to payment gateway...'}
            </Text>
            <Text style={styles.processingAmount}>${amount}</Text>
            <Text style={styles.processingNote}>Please do not close this screen</Text>
          </View>
        </View>
      </>
    );
  }

  if (step === 'result') {
    return (
      <>
        <Stack.Screen options={{ title: paymentSuccess ? 'Payment Successful' : 'Payment Failed', headerLeft: () => null }} />
        <View style={styles.centerContainer}>
          <View style={styles.resultIcon}>
            <Ionicons
              name={paymentSuccess ? 'checkmark-circle' : 'close-circle'}
              size={80}
              color={paymentSuccess ? colors.success : colors.error}
            />
          </View>
          <Text style={styles.resultTitle}>
            {paymentSuccess ? 'Payment Successful!' : 'Payment Failed'}
          </Text>
          <Text style={styles.resultSubtitle}>
            {paymentSuccess
              ? `$${amount} has been paid successfully via ${PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.label}`
              : 'Something went wrong. Please try again.'}
          </Text>
          {paymentSuccess && (
            <View style={styles.receiptCard}>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Amount</Text>
                <Text style={styles.receiptValue}>${amount}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Method</Text>
                <Text style={styles.receiptValue}>{PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.label}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Booking</Text>
                <Text style={styles.receiptValue}>#{bookingId}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Status</Text>
                <Text style={[styles.receiptValue, { color: colors.success }]}>Paid</Text>
              </View>
            </View>
          )}
          <View style={styles.resultActions}>
            {paymentSuccess ? (
              <Button
                title="View Booking"
                onPress={() => router.replace(`/booking/${bookingId}`)}
                size="lg"
                style={{ width: '100%' }}
              />
            ) : (
              <>
                <Button
                  title="Try Again"
                  onPress={() => setStep('select')}
                  size="lg"
                  style={{ width: '100%' }}
                />
                <Button
                  title="Go Back"
                  onPress={() => router.back()}
                  variant="outline"
                  size="lg"
                  style={{ width: '100%' }}
                />
              </>
            )}
          </View>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Payment' }} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Amount Summary */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Total Amount</Text>
          <Text style={styles.amountValue}>${amount}</Text>
          <Text style={styles.amountBooking}>Booking #{bookingId}</Text>
        </View>

        {/* Payment Methods */}
        <Text style={styles.sectionTitle}>Select Payment Method</Text>
        <View style={styles.methodsList}>
          {PAYMENT_METHODS.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[styles.methodCard, selectedMethod === method.id && styles.methodCardActive]}
              onPress={() => setSelectedMethod(method.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.methodIcon, selectedMethod === method.id && styles.methodIconActive]}>
                <Ionicons
                  name={method.icon}
                  size={24}
                  color={selectedMethod === method.id ? colors.white : colors.gray[500]}
                />
              </View>
              <View style={styles.methodInfo}>
                <Text style={[styles.methodLabel, selectedMethod === method.id && styles.methodLabelActive]}>
                  {method.label}
                </Text>
                <Text style={styles.methodDescription}>{method.description}</Text>
              </View>
              <View style={[styles.radio, selectedMethod === method.id && styles.radioActive]}>
                {selectedMethod === method.id && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Mock Gateway Notice */}
        <View style={styles.mockNotice}>
          <Ionicons name="information-circle-outline" size={18} color={colors.info} />
          <Text style={styles.mockNoticeText}>
            This is a mock payment gateway. No real charges will be made.
          </Text>
        </View>

        <Button
          title={`Pay $${amount}`}
          onPress={handlePay}
          size="lg"
          style={styles.payButton}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.xl },
  centerContainer: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: spacing['3xl'] },
  amountCard: {
    backgroundColor: colors.primary,
    padding: spacing['2xl'],
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  amountLabel: { ...typography.small, color: 'rgba(255,255,255,0.7)' },
  amountValue: { fontSize: 40, fontWeight: '700', color: colors.white, marginVertical: spacing.xs },
  amountBooking: { ...typography.small, color: 'rgba(255,255,255,0.7)' },
  sectionTitle: { ...typography.bodyMedium, color: colors.text, marginBottom: spacing.md },
  methodsList: { gap: spacing.sm, marginBottom: spacing.xl },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border,
  },
  methodCardActive: { borderColor: colors.primary, backgroundColor: colors.primaryBg },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodIconActive: { backgroundColor: colors.primary },
  methodInfo: { flex: 1, marginLeft: spacing.md },
  methodLabel: { ...typography.bodyMedium, color: colors.text },
  methodLabelActive: { color: colors.primary },
  methodDescription: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: colors.primary },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  mockNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.infoBg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xl,
  },
  mockNoticeText: { ...typography.small, color: colors.info, flex: 1 },
  payButton: { marginBottom: spacing['4xl'] },
  processingCard: { alignItems: 'center', gap: spacing.lg },
  processingTitle: { ...typography.h3, color: colors.text },
  processingSubtitle: { ...typography.body, color: colors.textSecondary },
  processingAmount: { fontSize: 36, fontWeight: '700', color: colors.primary },
  processingNote: { ...typography.caption, color: colors.textLight },
  resultIcon: { marginBottom: spacing.xl },
  resultTitle: { ...typography.h2, color: colors.text, textAlign: 'center' },
  resultSubtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm },
  receiptCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginTop: spacing['2xl'],
    borderWidth: 1,
    borderColor: colors.border,
  },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm },
  receiptLabel: { ...typography.body, color: colors.textSecondary },
  receiptValue: { ...typography.bodyMedium, color: colors.text },
  resultActions: { width: '100%', marginTop: spacing['2xl'], gap: spacing.md },
});
