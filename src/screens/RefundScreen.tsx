import React, { useState } from 'react';
import { Alert, Button, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import { demoTransactions } from '../services/mockApi';
import { refundPayment } from '../services/stripeTerminal';

interface Props {
  terminalBaseUrl: string;
  onBack: () => void;
}

const inputStyle = {
  backgroundColor: '#0b1224',
  color: 'white',
  padding: 12,
  borderRadius: 12,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: '#1f2937',
};

export const RefundScreen: React.FC<Props> = ({ terminalBaseUrl, onBack }) => {
  const [paymentIntentId, setPaymentIntentId] = useState(demoTransactions[0]?.id ?? '');
  const [amount, setAmount] = useState('');

  const submitRefund = async () => {
    try {
      const parsedAmount = amount ? Math.round(parseFloat(amount) * 100) : undefined;
      await refundPayment(terminalBaseUrl, paymentIntentId, parsedAmount);
      Alert.alert('Remboursement envoyé', 'Stripe va recréditer le client.');
    } catch (error) {
      Alert.alert('Erreur', (error as Error).message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <ScrollView style={{ padding: 20 }}>
        <Text style={{ color: 'white', fontSize: 22, fontWeight: '800', marginBottom: 8 }}>Rembourser un client</Text>
        <Text style={{ color: '#cbd5e1', marginBottom: 16 }}>
          Saisissez l'identifiant du PaymentIntent pour déclencher un remboursement total ou partiel.
        </Text>

        <TextInput
          placeholder="PaymentIntent ID (pi_...)"
          placeholderTextColor="#64748b"
          style={inputStyle}
          value={paymentIntentId}
          onChangeText={setPaymentIntentId}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Montant (laisser vide pour total)"
          placeholderTextColor="#64748b"
          style={inputStyle}
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />

        <Button title="Lancer le remboursement" onPress={submitRefund} />
        <View style={{ marginTop: 12 }}>
          <Button title="Retour" onPress={onBack} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
