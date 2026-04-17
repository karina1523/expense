export type TransactionType = 'income' | 'outcome';

export interface Transaction {
  id: string;
  amount: number;
  label: string;
  category: string;
  date: string; // ISO string
  type: TransactionType;
}

export type TimeFilter = 'daily' | 'weekly' | '3months' | 'yearly';

export interface CategoryPreset {
  label: string;
  icon: string;
  color: string;
}

export interface FilteredSummary {
  totalIncome: number;
  totalSpent: number;
  netSavings: number;
}
