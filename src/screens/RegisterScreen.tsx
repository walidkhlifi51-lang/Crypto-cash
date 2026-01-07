import React, { useState } from 'react';
import { Button, SafeAreaView, Text, TextInput, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

interface Props {
  onLogin: () => void;
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

export const RegisterScreen: React.FC<Props> = ({ onLogin }) => {
  const { register } = useAuth();
  const [displayName, setDisplayName] = useState('Boutique Demo');
  const [emailOrPhone, setEmailOrPhone] = useState('boutique@example.com');
  const [password, setPassword] = useState('demo-password');

  const handleRegister = async () => {
    await register({ displayName, emailOrPhone, password });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a', padding: 20 }}>
      <Text style={{ color: 'white', fontSize: 26, fontWeight: '800', marginBottom: 12 }}>
        Créer un compte marchand
      </Text>
      <TextInput
        placeholder="Nom de la boutique"
        placeholderTextColor="#64748b"
        style={inputStyle}
        value={displayName}
        onChangeText={setDisplayName}
      />
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
      <Button title="Créer" onPress={handleRegister} />
      <View style={{ marginTop: 16 }}>
        <Button title="Déjà un compte ?" onPress={onLogin} />
      </View>
    </SafeAreaView>
  );
};
