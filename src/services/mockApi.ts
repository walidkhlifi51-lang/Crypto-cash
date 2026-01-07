import { Transaction, TransactionStatus, TransactionType } from '../types';

const now = new Date();

export const demoTransactions: Transaction[] = [
  {
    id: 'pi_1',
    amount: 24.99,
    currency: 'eur',
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 3).toISOString(),
    type: 'tap_to_pay',
    status: 'succeeded',
    customerName: 'Alice Martin',
    last4: '4242',
  },
  {
    id: 'pi_2',
    amount: 59.5,
    currency: 'eur',
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 26).toISOString(),
    type: 'card_on_file',
    status: 'succeeded',
    customerName: 'Marc Louis',
    last4: '4000',
  },
  {
    id: 'rf_1',
    amount: -24.99,
    currency: 'eur',
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 70).toISOString(),
    type: 'refund',
    status: 'refunded',
    description: 'Remboursement client',
  },
];

export interface TransactionFilters {
  type?: TransactionType;
  status?: TransactionStatus;
  since?: Date;
  until?: Date;
}

export const filterTransactions = (filters: TransactionFilters): Transaction[] => {
  return demoTransactions.filter((tx) => {
    const createdAt = new Date(tx.createdAt).getTime();
    const since = filters.since?.getTime() ?? -Infinity;
    const until = filters.until?.getTime() ?? Infinity;

    return (
      createdAt >= since &&
      createdAt <= until &&
      (!filters.type || tx.type === filters.type) &&
      (!filters.status || tx.status === filters.status)
    );
  });
};

export const formatCurrency = (value: number, currency: string) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(value);
};
