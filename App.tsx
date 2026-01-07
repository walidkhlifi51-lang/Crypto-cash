import React, { useEffect, useState } from 'react';
import { StatusBar, Text, View } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { PaymentScreen } from './src/screens/PaymentScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { RefundScreen } from './src/screens/RefundScreen';
import { CardVaultScreen } from './src/screens/CardVaultScreen';
import { StripeAppProvider, bootstrapStripe } from './src/services/stripeTerminal';

const PUBLISHABLE_KEY = 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const TERMINAL_BASE_URL = 'https://your-backend.example.com/terminal';
const SETUP_INTENT_CLIENT_SECRET = 'seti_xxx_secret_xxx';
const DEMO_CUSTOMER_ID = 'cus_xxx_demo';

type Screen = 'login' | 'register' | 'home' | 'payment' | 'history' | 'refund' | 'card';

const AppNavigator: React.FC = () => {
  const { user } = useAuth();
  const [screen, setScreen] = useState<Screen>('login');

  useEffect(() => {
    bootstrapStripe(PUBLISHABLE_KEY).catch((error) => console.warn('Stripe init error', error));
  }, []);

  if (!user && screen !== 'register') {
    return <LoginScreen onRegister={() => setScreen('register')} />;
  }

  if (!user && screen === 'register') {
    return <RegisterScreen onLogin={() => setScreen('login')} />;
  }

  if (screen === 'payment') {
    return <PaymentScreen terminalBaseUrl={TERMINAL_BASE_URL} onBack={() => setScreen('home')} />;
  }

  if (screen === 'history') {
    return <HistoryScreen onBack={() => setScreen('home')} />;
  }

  if (screen === 'refund') {
    return <RefundScreen terminalBaseUrl={TERMINAL_BASE_URL} onBack={() => setScreen('home')} />;
  }

  if (screen === 'card') {
    return (
      <CardVaultScreen
        onBack={() => setScreen('home')}
        setupIntentClientSecret={SETUP_INTENT_CLIENT_SECRET}
        customerId={DEMO_CUSTOMER_ID}
      />
    );
  }

  return (
    <HomeScreen
      onPayment={() => setScreen('payment')}
      onHistory={() => setScreen('history')}
      onCardVault={() => setScreen('card')}
      onRefund={() => setScreen('refund')}
    />
  );
};

const App = () => {
  return (
    <StripeAppProvider publishableKey={PUBLISHABLE_KEY}>
      <AuthProvider>
        <StatusBar barStyle="light-content" />
        <View style={{ flex: 1, backgroundColor: '#0f172a' }}>
          <AppNavigator />
          <Text
            style={{
              color: '#64748b',
              textAlign: 'center',
              paddingBottom: 10,
              fontSize: 12,
            }}
          >
            Démo : remplacez les clés Stripe et ajoutez vos endpoints backend sécurisés.
          </Text>
        </View>
      </AuthProvider>
    </StripeAppProvider>
  );
};

export default App;
