import * as Print from 'expo-print';
import { Transaction } from '../types';

export const generateHistoryPdf = async (transactions: Transaction[]) => {
  const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 16px; }
          h1 { color: #0f172a; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; font-size: 12px; }
          th { background: #0f172a; color: white; }
        </style>
      </head>
      <body>
        <h1>Historique des transactions</h1>
        <table>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Montant</th>
            <th>Statut</th>
          </tr>
          ${transactions
            .map(
              (tx) => `
                <tr>
                  <td>${new Date(tx.createdAt).toLocaleString()}</td>
                  <td>${tx.type}</td>
                  <td>${tx.amount.toFixed(2)} ${tx.currency.toUpperCase()}</td>
                  <td>${tx.status}</td>
                </tr>
              `,
            )
            .join('')}
        </table>
      </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html });
  return uri;
};
