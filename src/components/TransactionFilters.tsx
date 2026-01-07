import React, { useMemo, useState } from 'react';
import { View, Text, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TransactionType, TransactionStatus } from '../types';

interface Props {
  onChange: (payload: {
    type?: TransactionType;
    status?: TransactionStatus;
    since?: Date;
    until?: Date;
  }) => void;
}

export const TransactionFilters: React.FC<Props> = ({ onChange }) => {
  const [type, setType] = useState<TransactionType | undefined>();
  const [status, setStatus] = useState<TransactionStatus | undefined>();
  const [since, setSince] = useState<Date | undefined>();
  const [until, setUntil] = useState<Date | undefined>();

  const filterPayload = useMemo(() => ({ type, status, since, until }), [type, status, since, until]);

  return (
    <View style={{ backgroundColor: '#0f172a', padding: 12, borderRadius: 12, gap: 8 }}>
      <Text style={{ color: 'white', fontWeight: '600' }}>Filtres rapides</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Button title={type === 'tap_to_pay' ? 'Tap to Pay ✓' : 'Tap to Pay'} onPress={() => setType('tap_to_pay')} />
        <Button title={type === 'card_on_file' ? 'Carte enregistrée ✓' : 'Carte enregistrée'} onPress={() => setType('card_on_file')} />
        <Button title="Réinitialiser" onPress={() => setType(undefined)} />
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Button title={status === 'succeeded' ? 'Succès ✓' : 'Succès'} onPress={() => setStatus('succeeded')} />
        <Button title={status === 'refunded' ? 'Remboursé ✓' : 'Remboursé'} onPress={() => setStatus('refunded')} />
        <Button title="Tout" onPress={() => setStatus(undefined)} />
      </View>
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <Text style={{ color: 'white' }}>Depuis</Text>
        <DateTimePicker
          mode="date"
          value={since ?? new Date()}
          onChange={(_, date) => setSince(date ?? undefined)}
          style={{ flex: 1 }}
        />
      </View>
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <Text style={{ color: 'white' }}>Jusqu'au</Text>
        <DateTimePicker
          mode="date"
          value={until ?? new Date()}
          onChange={(_, date) => setUntil(date ?? undefined)}
          style={{ flex: 1 }}
        />
      </View>
      <Button title="Appliquer" onPress={() => onChange(filterPayload)} />
    </View>
  );
};
