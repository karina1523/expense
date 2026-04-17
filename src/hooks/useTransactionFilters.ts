import { useMemo } from 'react';
import type { Transaction, TimeFilter, FilteredSummary } from '@/types';

export function useTransactionFilters(
  transactions: Transaction[],
  filter: TimeFilter
): { filtered: Transaction[]; summary: FilteredSummary } {
  const now = new Date();
  
  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const tDate = new Date(t.date);
      
      switch (filter) {
        case 'daily':
          return (
            tDate.getDate() === now.getDate() &&
            tDate.getMonth() === now.getMonth() &&
            tDate.getFullYear() === now.getFullYear()
          );
        
        case 'weekly':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return tDate >= weekAgo;
        
        case '3months':
          const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          return tDate >= threeMonthsAgo;
        
        case 'yearly':
          return tDate.getFullYear() === now.getFullYear();
        
        default:
          return true;
      }
    });
  }, [transactions, filter]);

  const summary = useMemo<FilteredSummary>(() => {
    const totalIncome = filtered
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalSpent = filtered
      .filter((t) => t.type === 'outcome')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalIncome,
      totalSpent,
      netSavings: totalIncome - totalSpent,
    };
  }, [filtered]);

  return { filtered, summary };
}
