export type UserRole = 'merchant' | 'cashier';

export interface UserProfile {
  id: string;
  email?: string;
  phone?: string;
  displayName: string;
  role: UserRole;
}

export type TransactionStatus = 'succeeded' | 'processing' | 'refunded' | 'failed';
export type TransactionType = 'tap_to_pay' | 'card_on_file' | 'refund' | 'payout';

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  createdAt: string;
  type: TransactionType;
  status: TransactionStatus;
  customerName?: string;
  last4?: string;
  description?: string;
}
