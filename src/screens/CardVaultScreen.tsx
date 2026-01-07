import React, { useState } from 'react';
import { Alert, Button, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { attachCardOnFile } from '../services/stripeTerminal';

interface Props {
  onBack: () => void;
  setupIntentClientSecret: string;
  customerId: string;
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

export const CardVaultScreen: React.FC<Props> = ({ onBack, setupIntentClientSecret, customerId }) => {
  const stripe = useStripe();
  const [customerName, setCustomerName] = useState('Alice Martin');
  const [loading, setLoading] = useState(false);

  const handleAttach = async () => {
    setLoading(true);
    try {
      const { paymentMethodId } = await attachCardOnFile(stripe, customerId, setupIntentClientSecret);
      Alert.alert('Carte enregistrée', `Paiement futur possible avec PM ${paymentMethodId}`);
    } catch (error) {
      Alert.alert('Erreur carte', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <ScrollView style={{ padding: 20 }}>
        <Text style={{ color: 'white', fontSize: 22, fontWeight: '800', marginBottom: 8 }}>Carte enregistrée</Text>
        <Text style={{ color: '#cbd5e1', marginBottom: 16 }}>
          Utilisez un SetupIntent pour enregistrer la carte du client (PCI compliant via Stripe) puis facturez-la plus tard.
        </Text>

        <TextInput
          placeholder="Nom du client"
          placeholderTextColor="#64748b"
          style={inputStyle}
          value={customerName}
          onChangeText={setCustomerName}
        />

        <Button title={loading ? 'En cours...' : 'Connecter la carte'} onPress={handleAttach} disabled={loading} />
        <View style={{ marginTop: 12 }}>
          <Button title="Retour" onPress={onBack} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
