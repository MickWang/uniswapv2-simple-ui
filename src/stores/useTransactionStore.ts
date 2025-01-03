import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Transaction {
  hash: string;
  type: 'swap' | 'liquidity';
  inputToken: string;
  inputAmount: string;
  outputToken: string;
  outputAmount: string;
  timestamp: number;
  walletAddress: string;
  lpTokens?: string;
}

interface TransactionStore {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  getTransactionsByType: (type: Transaction['type']) => Transaction[];
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [transaction, ...state.transactions]
        })),
      getTransactionsByType: (type) =>
        get().transactions.filter((tx) => tx.type === type)
    }),
    {
      name: 'transaction-store'
    }
  )
);