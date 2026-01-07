import React, { useState } from 'react';
import { ActivityIndicator, Button, SafeAreaView, Text, TextInput, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

interface Props {
  onRegister: () => void;
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

export const LoginScreen: React.FC<Props> = ({ onRegister }) => {
  const { login, loading } = useAuth();
  const [emailOrPhone, setEmailOrPhone] = useState('merchant@example.com');
  const [password, setPassword] = useState('demo-password');

  const handleLogin = async () => {
    await login({ emailOrPhone, password });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a', padding: 20 }}>
      <View style={{ marginTop: 40 }}>
        <Text style={{ color: 'white', fontSize: 28, fontWeight: '800', marginBottom: 12 }}>
          CryptoCash Tap to Pay
        </Text>
        <Text style={{ color: '#cbd5e1', marginBottom: 24 }}>
          Encaissez en magasin sans terminal physique, avec Stripe Tap to Pay et les cartes enregistrées.
        </Text>
        <TextInput
          placeholder="Email ou téléphone"
          placeholderTextColor="#64748b"
          style={inputStyle}
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Mot de passe"
          placeholderTextColor="#64748b"
          style={inputStyle}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button title={loading ? 'Connexion...' : 'Se connecter'} onPress={handleLogin} />
        {loading && <ActivityIndicator color="white" style={{ marginTop: 12 }} />}
        <View style={{ marginTop: 16 }}>
          <Button title="Créer un compte" onPress={onRegister} />
        </View>
      </View>
    </SafeAreaView>
  );
};
