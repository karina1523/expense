import { useState, useEffect, useRef, useCallback } from 'react';
import anime from 'animejs';
import { cn } from '@/utils/cn';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useTransactionFilters } from '@/hooks/useTransactionFilters';
import { MeshGradientBackground } from '@/components/MeshGradientBackground';
import { BalanceCard } from '@/components/BalanceCard';
import { SpendingBreakdown } from '@/components/SpendingBreakdown';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { TimeFilterTabs } from '@/components/TimeFilterTabs';
import type { Transaction, TimeFilter } from '@/types';
import { Wallet, PieChart, List, Plus } from 'lucide-react';

function App() {
  // Local storage for transactions
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('expense-tracker-transactions', []);
  
  // UI State
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('weekly');
  const [pulseTrigger, setPulseTrigger] = useState(0);
  const [showMobileForm, setShowMobileForm] = useState(false);
  
  // Refs for animations
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Filtered transactions and summary
  const { filtered, summary } = useTransactionFilters(transactions, timeFilter);

  // Mount sequence animation
  useEffect(() => {
    const tl = anime.timeline({ easing: 'easeOutExpo' });
    
    // Header animation
    if (headerRef.current) {
      tl.add({
        targets: headerRef.current,
        translateY: [-30, 0],
        opacity: [0, 1],
        duration: 800,
      });
    }
    
    // Cards stagger animation
    if (cardsRef.current) {
      tl.add({
        targets: cardsRef.current.children,
        translateY: [40, 0],
        opacity: [0, 1],
        duration: 700,
        delay: anime.stagger(100),
      }, '-=400');
    }
    
    // Content animation
    if (contentRef.current) {
      tl.add({
        targets: contentRef.current.children,
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 600,
        delay: anime.stagger(80),
      }, '-=300');
    }
  }, []);

  // Handle adding a new transaction
  const handleAddTransaction = useCallback((data: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...data,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    
    setTransactions((prev) => [newTransaction, ...prev]);
    
    // Trigger pulse on balance card
    setPulseTrigger((prev) => prev + 1);
    
    // Close mobile form if open
    setShowMobileForm(false);
  }, [setTransactions]);

  // Handle deleting a transaction
  const handleDeleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, [setTransactions]);

  // Handle time filter change with animation
  const handleTimeFilterChange = useCallback((filter: TimeFilter) => {
    setTimeFilter(filter);
    
    // Animate content refresh
    if (contentRef.current) {
      anime({
        targets: contentRef.current.querySelectorAll('.animate-on-filter'),
        opacity: [0.5, 1],
        translateY: [5, 0],
        duration: 400,
        easing: 'easeOutQuad',
        delay: anime.stagger(50),
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-x-hidden">
      {/* Animated Mesh Gradient Background */}
      <MeshGradientBackground />
      
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Header */}
        <header ref={headerRef} className="mb-8 lg:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <Wallet size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
                  Expense Tracker
                </h1>
                <p className="text-xs text-slate-400">Manage your finances</p>
              </div>
            </div>
            
            {/* Time Filter Tabs - Desktop */}
            <div className="hidden sm:block">
              <TimeFilterTabs value={timeFilter} onChange={handleTimeFilterChange} />
            </div>
          </div>
          
          {/* Time Filter Tabs - Mobile */}
          <div className="sm:hidden mt-4 overflow-x-auto pb-2">
            <TimeFilterTabs value={timeFilter} onChange={handleTimeFilterChange} />
          </div>
        </header>

        {/* Balance Cards */}
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-8"
        >
          <BalanceCard
            title="Total Income"
            value={summary.totalIncome}
            type="income"
          />
          <BalanceCard
            title="Total Spent"
            value={summary.totalSpent}
            type="outcome"
            pulseTrigger={pulseTrigger}
          />
          <BalanceCard
            title="Net Savings"
            value={summary.netSavings}
            type="savings"
          />
        </div>

        {/* Main Content Grid */}
        <div 
          ref={contentRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Left Column - Form (Desktop) */}
          <div className="hidden lg:block lg:col-span-4 animate-on-filter">
            <TransactionForm onAdd={handleAddTransaction} />
          </div>

          {/* Middle Column - Transaction List */}
          <div className="lg:col-span-5 animate-on-filter">
            <TransactionList
              transactions={filtered}
              onDelete={handleDeleteTransaction}
            />
          </div>

          {/* Right Column - Spending Breakdown */}
          <div className="lg:col-span-3 animate-on-filter">
            <SpendingBreakdown transactions={filtered} />
          </div>
        </div>

        {/* Mobile Add Button */}
        <button
          onClick={() => setShowMobileForm(true)}
          className={cn(
            'lg:hidden fixed bottom-6 right-6 z-50',
            'w-14 h-14 rounded-full',
            'bg-gradient-to-r from-indigo-500 to-fuchsia-500',
            'flex items-center justify-center',
            'shadow-lg shadow-indigo-500/40',
            'hover:scale-110 transition-transform duration-200'
          )}
        >
          <Plus size={28} className="text-white" />
        </button>

        {/* Mobile Form Modal */}
        {showMobileForm && (
          <div 
            className="lg:hidden fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl"
            onClick={() => setShowMobileForm(false)}
          >
            <div 
              className="absolute bottom-0 left-0 right-0 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <TransactionForm 
                onAdd={handleAddTransaction}
                className="max-h-[80vh] overflow-y-auto"
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-12 py-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              Data stored locally in your browser
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <PieChart size={14} />
                <span>{transactions.length} total transactions</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <List size={14} />
                <span>{filtered.length} filtered</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
