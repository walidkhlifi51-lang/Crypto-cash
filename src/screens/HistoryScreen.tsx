import React, { useState } from 'react';
import { Alert, Button, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { TransactionFilters, filterTransactions } from '../services/mockApi';
import { TransactionFilters as FilterComponent } from '../components/TransactionFilters';
import { TransactionList } from '../components/TransactionList';
import { generateHistoryPdf } from '../services/pdf';

interface Props {
  onBack: () => void;
}

export const HistoryScreen: React.FC<Props> = ({ onBack }) => {
  const [filters, setFilters] = useState<TransactionFilters>({});
  const filtered = filterTransactions(filters);

  const exportPdf = async () => {
    try {
      const uri = await generateHistoryPdf(filtered);
      Alert.alert('PDF généré', `Historique sauvegardé: ${uri}`);
    } catch (error) {
      Alert.alert('Erreur export', (error as Error).message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <ScrollView style={{ padding: 20 }}>
        <Text style={{ color: 'white', fontSize: 22, fontWeight: '800', marginBottom: 8 }}>Historique</Text>
        <Text style={{ color: '#cbd5e1', marginBottom: 16 }}>
          Recherchez par jour, mois ou année puis exportez en PDF pour la comptabilité.
        </Text>

        <FilterComponent onChange={setFilters} />

        <View style={{ marginTop: 12, gap: 8 }}>
          <Button title="Exporter en PDF" onPress={exportPdf} />
          <Button title="Retour" onPress={onBack} />
        </View>

        <View style={{ marginTop: 16 }}>
          <TransactionList transactions={filtered} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
