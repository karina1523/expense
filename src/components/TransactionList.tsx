import { useRef, useEffect, useState } from 'react';
import anime from 'animejs';
import { cn } from '@/utils/cn';
import type { Transaction } from '@/types';
import { 
  ShoppingCart, Receipt, Utensils, Briefcase, Film, Car, Heart, MoreHorizontal,
  Trash2, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  className?: string;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'Shopping': ShoppingCart,
  'Bills': Receipt,
  'Food': Utensils,
  'Salary': Briefcase,
  'Entertainment': Film,
  'Transport': Car,
  'Health': Heart,
  'Other': MoreHorizontal,
};

const CATEGORY_COLORS: Record<string, string> = {
  'Shopping': 'bg-rose-500/20 text-rose-400',
  'Bills': 'bg-amber-500/20 text-amber-400',
  'Food': 'bg-emerald-500/20 text-emerald-400',
  'Salary': 'bg-indigo-500/20 text-indigo-400',
  'Entertainment': 'bg-violet-500/20 text-violet-400',
  'Transport': 'bg-cyan-500/20 text-cyan-400',
  'Health': 'bg-pink-500/20 text-pink-400',
  'Other': 'bg-slate-500/20 text-slate-400',
};

export function TransactionList({ transactions, onDelete, className }: TransactionListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Mount animation for list items
  useEffect(() => {
    const items = Object.values(itemRefs.current).filter(Boolean);
    if (items.length > 0) {
      anime({
        targets: items,
        translateX: [-30, 0],
        opacity: [0, 1],
        duration: 500,
        easing: 'easeOutExpo',
        delay: anime.stagger(50),
      });
    }
  }, [transactions.length]);

  const handleDelete = (id: string) => {
    const item = itemRefs.current[id];
    if (!item) return;
    
    setDeletingId(id);
    
    anime({
      targets: item,
      translateX: [0, -100],
      opacity: [1, 0],
      height: [item.offsetHeight, 0],
      marginBottom: [12, 0],
      padding: [16, 0],
      duration: 400,
      easing: 'easeInOutQuad',
      complete: () => {
        onDelete(id);
        setDeletingId(null);
      },
    });
  };

  const handleMouseEnter = (id: string) => {
    const item = itemRefs.current[id];
    if (item && deletingId !== id) {
      anime({
        targets: item,
        translateX: 8,
        duration: 200,
        easing: 'easeOutQuad',
      });
    }
  };

  const handleMouseLeave = (id: string) => {
    const item = itemRefs.current[id];
    if (item && deletingId !== id) {
      anime({
        targets: item,
        translateX: 0,
        duration: 200,
        easing: 'easeOutQuad',
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (transactions.length === 0) {
    return (
      <div className={cn(
        'rounded-2xl backdrop-blur-xl',
        'bg-white/5 border border-white/10 shadow-2xl p-8',
        'flex flex-col items-center justify-center',
        className
      )}>
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <Receipt size={28} className="text-slate-500" />
        </div>
        <p className="text-slate-400 text-sm">No transactions yet</p>
        <p className="text-slate-500 text-xs mt-1">Add your first transaction above</p>
      </div>
    );
  }

  return (
    <div className={cn(
      'rounded-2xl backdrop-blur-xl',
      'bg-white/5 border border-white/10 shadow-2xl',
      'overflow-hidden',
      className
    )}>
      <div className="p-4 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white">Transactions</h3>
        <p className="text-xs text-slate-400">{transactions.length} items</p>
      </div>
      
      <div ref={listRef} className="max-h-[400px] overflow-y-auto p-4 space-y-3">
        {transactions.map((transaction) => {
          const Icon = CATEGORY_ICONS[transaction.category] || MoreHorizontal;
          const colorClass = CATEGORY_COLORS[transaction.category] || CATEGORY_COLORS['Other'];
          const isIncome = transaction.type === 'income';
          
          return (
            <div
              key={transaction.id}
              ref={(el) => { itemRefs.current[transaction.id] = el; }}
              onMouseEnter={() => handleMouseEnter(transaction.id)}
              onMouseLeave={() => handleMouseLeave(transaction.id)}
              className={cn(
                'group relative flex items-center gap-4 p-4 rounded-xl',
                'bg-white/[0.03] border border-white/5',
                'hover:bg-white/[0.05] hover:border-white/10',
                'transition-colors duration-200',
                'cursor-default'
              )}
            >
              {/* Category Icon */}
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                colorClass
              )}>
                <Icon size={18} />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white truncate">
                    {transaction.label}
                  </p>
                  {isIncome ? (
                    <ArrowUpRight size={14} className="text-emerald-400 shrink-0" />
                  ) : (
                    <ArrowDownRight size={14} className="text-rose-400 shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-400">{transaction.category}</span>
                  <span className="text-xs text-slate-600">•</span>
                  <span className="text-xs text-slate-500">{formatDate(transaction.date)}</span>
                </div>
              </div>
              
              {/* Amount */}
              <div className={cn(
                'text-right shrink-0',
                isIncome ? 'text-emerald-400' : 'text-rose-400'
              )}>
                <p className="text-sm font-semibold tabular-nums">
                  {isIncome ? '+' : '-'}${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              
              {/* Delete Button */}
              <button
                onClick={() => handleDelete(transaction.id)}
                className={cn(
                  'opacity-0 group-hover:opacity-100',
                  'p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10',
                  'transition-all duration-200'
                )}
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
