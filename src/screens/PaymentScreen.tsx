import React, { useState } from 'react';
import { Alert, Button, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import { startTapToPay } from '../services/stripeTerminal';
import { demoTransactions, formatCurrency } from '../services/mockApi';

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

export const PaymentScreen: React.FC<Props> = ({ terminalBaseUrl, onBack }) => {
  const [amount, setAmount] = useState('24.99');
  const [loading, setLoading] = useState(false);
  const lastSale = demoTransactions[0];

  const handleTapToPay = async () => {
    setLoading(true);
    try {
      const cents = Math.round(parseFloat(amount) * 100);
      const { transaction } = await startTapToPay(cents, 'eur', terminalBaseUrl, (reader) => {
        Alert.alert('Lecteur prêt', `Connecté à ${reader.label ?? reader.serialNumber}`);
      });
      Alert.alert('Paiement réussi', `${formatCurrency(transaction.amount, 'EUR')} encaissés`);
    } catch (error) {
      Alert.alert('Erreur', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <ScrollView style={{ padding: 20 }}>
        <Text style={{ color: 'white', fontSize: 22, fontWeight: '800', marginBottom: 8 }}>Tap to Pay</Text>
        <Text style={{ color: '#cbd5e1', marginBottom: 16 }}>
          Encaissez avec Stripe Terminal (Tap to Pay sur iPhone/Android) sans matériel supplémentaire.
        </Text>

        <Text style={{ color: '#cbd5e1', marginBottom: 6 }}>Montant à encaisser</Text>
        <TextInput
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
          style={inputStyle}
          placeholder="Montant"
          placeholderTextColor="#64748b"
        />

        <Button title={loading ? 'Connexion au lecteur...' : 'Lancer Tap to Pay'} onPress={handleTapToPay} disabled={loading} />
        <View style={{ marginTop: 12 }}>
          <Button title="Retour" onPress={onBack} />
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={{ color: 'white', fontWeight: '700', marginBottom: 6 }}>Dernière vente</Text>
          <Text style={{ color: '#cbd5e1' }}>
            {formatCurrency(lastSale.amount, 'EUR')} · {new Date(lastSale.createdAt).toLocaleString()}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
