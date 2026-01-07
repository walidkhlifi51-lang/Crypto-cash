import React from 'react';
import { Button, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { demoTransactions, formatCurrency } from '../services/mockApi';
import { useAuth } from '../context/AuthContext';
import { SummaryCards } from '../components/SummaryCards';
import { TransactionList } from '../components/TransactionList';

interface Props {
  onPayment: () => void;
  onHistory: () => void;
  onCardVault: () => void;
  onRefund: () => void;
}

export const HomeScreen: React.FC<Props> = ({ onPayment, onHistory, onCardVault, onRefund }) => {
  const { user, logout } = useAuth();

  const revenue30Days = demoTransactions
    .filter((tx) => tx.status === 'succeeded')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const revenueToday = demoTransactions
    .filter((tx) => new Date(tx.createdAt).toDateString() === new Date().toDateString())
    .reduce((sum, tx) => sum + tx.amount, 0);

  const refunds = demoTransactions.filter((tx) => tx.type === 'refund').reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <ScrollView style={{ padding: 20 }}>
        <Text style={{ color: 'white', fontSize: 22, fontWeight: '800', marginBottom: 4 }}>
          Bonjour {user?.displayName ?? 'marchand'}
        </Text>
        <Text style={{ color: '#cbd5e1', marginBottom: 12 }}>Encaissez avec Tap to Pay ou cartes enregistrées.</Text>

        <SummaryCards
          revenue={formatCurrency(revenue30Days, 'EUR')}
          today={formatCurrency(revenueToday, 'EUR')}
          refunds={formatCurrency(refunds, 'EUR')}
        />

        <View style={{ marginTop: 20, gap: 10 }}>
          <Button title="Encaisser (Tap to Pay)" onPress={onPayment} />
          <Button title="Cartes enregistrées" onPress={onCardVault} />
          <Button title="Historique & Export PDF" onPress={onHistory} />
          <Button title="Rembourser un client" onPress={onRefund} />
          <Button title="Se déconnecter" color="#ef4444" onPress={logout} />
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={{ color: 'white', fontWeight: '700', marginBottom: 8 }}>Dernières transactions</Text>
          <TransactionList transactions={demoTransactions.slice(0, 5)} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
