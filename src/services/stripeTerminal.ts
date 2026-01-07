import { StripeProvider, initStripe, useStripe } from '@stripe/stripe-react-native';
import { collectInputs, ConnectionToken, PaymentIntent, Reader } from '@stripe/stripe-terminal-react-native';
import { Transaction } from '../types';

export interface StripeConfig {
  publishableKey: string;
  terminalBaseUrl: string;
  merchantName: string;
}

export interface TapToPayResult {
  transaction: Transaction;
  paymentIntent: PaymentIntent;
}

// This provider should wrap your app. It has been split from App.tsx for clarity.
export const StripeAppProvider: React.FC<{ children: React.ReactNode; publishableKey: string }> = ({
  children,
  publishableKey,
}) => {
  return <StripeProvider publishableKey={publishableKey}>{children}</StripeProvider>;
};

export const bootstrapStripe = async (publishableKey: string) => {
  await initStripe({
    publishableKey,
    merchantIdentifier: 'merchant.com.example.cryptocash',
    urlScheme: 'cryptocash',
    setReturnUrlSchemeOnAndroid: true,
  });
};

export const fetchConnectionToken = async (terminalBaseUrl: string): Promise<ConnectionToken> => {
  const response = await fetch(`${terminalBaseUrl}/connection_token`, { method: 'POST' });
  if (!response.ok) throw new Error('Unable to fetch Stripe Terminal connection token');
  return (await response.json()) as ConnectionToken;
};

export const startTapToPay = async (
  amount: number,
  currency: string,
  terminalBaseUrl: string,
  onReaderDiscovered?: (reader: Reader) => void,
): Promise<TapToPayResult> => {
  // 1) Ask backend for a connection token then connect a Tap to Pay reader (Android or iOS)
  const token = await fetchConnectionToken(terminalBaseUrl);
  await collectInputs.setConnectionToken(token.secret);

  const readers = await collectInputs.discoverReaders({ simulated: true });
  const reader = readers[0];
  if (!reader) throw new Error('Aucun lecteur Tap to Pay trouvé');
  if (onReaderDiscovered) onReaderDiscovered(reader);
  await collectInputs.connectReader(reader.serialNumber);

  // 2) Create a PaymentIntent on your backend for Tap to Pay
  const piResponse = await fetch(`${terminalBaseUrl}/create_payment_intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, currency }),
  });
  if (!piResponse.ok) throw new Error('Impossible de créer un PaymentIntent');
  const paymentIntent = (await piResponse.json()) as PaymentIntent;

  // 3) Collect card-present payment
  const processedIntent = await collectInputs.collectPaymentMethod(paymentIntent.client_secret);
  await collectInputs.processPayment(processedIntent.client_secret);

  // 4) Build domain transaction model for the UI
  const transaction: Transaction = {
    id: processedIntent.id,
    amount: amount / 100,
    currency,
    createdAt: new Date().toISOString(),
    type: 'tap_to_pay',
    status: 'succeeded',
    description: 'Tap to Pay en magasin',
  };

  return { transaction, paymentIntent: processedIntent };
};

export const attachCardOnFile = async (
  stripe: ReturnType<typeof useStripe>,
  customerId: string,
  clientSecret: string,
): Promise<{ customerId: string; paymentMethodId: string }> => {
  const result = await stripe.confirmSetupIntent(clientSecret, {
    paymentMethodType: 'Card',
  });

  if (result.error) throw new Error(result.error.message ?? 'Impossible d’enregistrer la carte');

  return {
    customerId,
    paymentMethodId: result.setupIntent?.paymentMethodId ?? 'unknown',
  };
};

export const refundPayment = async (terminalBaseUrl: string, paymentIntentId: string, amount?: number) => {
  const res = await fetch(`${terminalBaseUrl}/refund`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payment_intent_id: paymentIntentId, amount }),
  });
  if (!res.ok) throw new Error('Le remboursement a échoué');
  return res.json();
};
