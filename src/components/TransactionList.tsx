import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { Transaction } from '../types';
import { formatCurrency } from '../services/mockApi';

interface Props {
  transactions: Transaction[];
}

const badgeColor: Record<string, string> = {
  succeeded: '#22c55e',
  refunded: '#f97316',
  processing: '#eab308',
  failed: '#ef4444',
};

export const TransactionList: React.FC<Props> = ({ transactions }) => {
  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View
          style={{
            backgroundColor: '#0b1224',
            padding: 16,
            borderRadius: 12,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: '#1f2937',
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ color: 'white', fontWeight: '600' }}>{item.description ?? item.type}</Text>
              <Text style={{ color: '#94a3b8', marginTop: 4 }}>{new Date(item.createdAt).toLocaleString()}</Text>
              {item.customerName && (
                <Text style={{ color: '#cbd5e1', marginTop: 4 }}>
                  {item.customerName} {item.last4 ? `· ···· ${item.last4}` : ''}
                </Text>
              )}
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ color: 'white', fontSize: 18, fontWeight: '700' }}>
                {formatCurrency(item.amount, item.currency.toUpperCase())}
              </Text>
              <Text
                style={{
                  marginTop: 6,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 999,
                  backgroundColor: badgeColor[item.status] ?? '#334155',
                  color: '#0f172a',
                  fontWeight: '700',
                }}
              >
                {item.status}
              </Text>
            </View>
          </View>
        </View>
      )}
      ListEmptyComponent={<Text style={{ color: 'white' }}>Aucune transaction pour cette période.</Text>}
    />
  );
};
