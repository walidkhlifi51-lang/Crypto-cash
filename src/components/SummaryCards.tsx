import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  revenue: string;
  today: string;
  refunds: string;
}

export const SummaryCards: React.FC<Props> = ({ revenue, today, refunds }) => (
  <View style={{ flexDirection: 'row', gap: 10 }}>
    <View style={cardStyle}> 
      <Text style={labelStyle}>CA 30 jours</Text>
      <Text style={valueStyle}>{revenue}</Text>
    </View>
    <View style={cardStyle}>
      <Text style={labelStyle}>Ventes du jour</Text>
      <Text style={valueStyle}>{today}</Text>
    </View>
    <View style={cardStyle}>
      <Text style={labelStyle}>Remboursements</Text>
      <Text style={valueStyle}>{refunds}</Text>
    </View>
  </View>
);

const cardStyle = {
  backgroundColor: '#0b1224',
  flex: 1,
  padding: 12,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#1f2937',
};

const labelStyle = { color: '#94a3b8', fontWeight: '600', marginBottom: 4 };
const valueStyle = { color: 'white', fontSize: 16, fontWeight: '700' };
