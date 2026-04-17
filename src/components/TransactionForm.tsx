import { useState, useRef, useEffect } from 'react';
import anime from 'animejs';
import { cn } from '@/utils/cn';
import type { Transaction, TransactionType } from '@/types';
import { Plus, ShoppingCart, Receipt, Utensils, Briefcase, Film, Car, Heart, MoreHorizontal } from 'lucide-react';

interface TransactionFormProps {
  onAdd: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  className?: string;
}

const CATEGORY_PRESETS = [
  { label: 'Shopping', icon: ShoppingCart, color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
  { label: 'Bills', icon: Receipt, color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { label: 'Food', icon: Utensils, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { label: 'Salary', icon: Briefcase, color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
  { label: 'Entertainment', icon: Film, color: 'bg-violet-500/20 text-violet-400 border-violet-500/30' },
  { label: 'Transport', icon: Car, color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  { label: 'Health', icon: Heart, color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  { label: 'Other', icon: MoreHorizontal, color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
];

export function TransactionForm({ onAdd, className }: TransactionFormProps) {
  const [amount, setAmount] = useState('');
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState('Shopping');
  const [type, setType] = useState<TransactionType>('outcome');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const formRef = useRef<HTMLFormElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Mount animation
  useEffect(() => {
    if (formRef.current) {
      anime({
        targets: formRef.current.querySelectorAll('.form-field'),
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutExpo',
        delay: anime.stagger(50),
      });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !label || isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Button press animation
    if (buttonRef.current) {
      anime({
        targets: buttonRef.current,
        scale: [1, 0.95, 1],
        duration: 200,
        easing: 'easeInOutQuad',
      });
    }
    
    onAdd({
      amount: parseFloat(amount),
      label,
      category,
      type,
    });
    
    // Reset form
    setAmount('');
    setLabel('');
    
    setTimeout(() => setIsSubmitting(false), 300);
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={cn(
        'rounded-2xl backdrop-blur-xl',
        'bg-white/5 border border-white/10 shadow-2xl p-6',
        className
      )}
    >
      <h3 className="text-lg font-semibold text-white mb-6">Add Transaction</h3>
      
      {/* Type Toggle */}
      <div className="form-field flex gap-2 mb-6 p-1 rounded-xl bg-white/5">
        <button
          type="button"
          onClick={() => setType('outcome')}
          className={cn(
            'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300',
            type === 'outcome'
              ? 'bg-rose-500/20 text-rose-400'
              : 'text-slate-400 hover:text-slate-200'
          )}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => setType('income')}
          className={cn(
            'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300',
            type === 'income'
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          )}
        >
          Income
        </button>
      </div>

      {/* Amount Input */}
      <div className="form-field mb-4">
        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
          Amount
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">$</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className={cn(
              'w-full pl-10 pr-4 py-3 rounded-xl',
              'bg-white/5 border border-white/10',
              'text-white text-lg font-medium placeholder:text-slate-500',
              'focus:outline-none focus:border-white/30 focus:bg-white/[0.07]',
              'transition-all duration-200'
            )}
          />
        </div>
      </div>

      {/* Label Input */}
      <div className="form-field mb-4">
        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
          Description
        </label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="What was this for?"
          className={cn(
            'w-full px-4 py-3 rounded-xl',
            'bg-white/5 border border-white/10',
            'text-white placeholder:text-slate-500',
            'focus:outline-none focus:border-white/30 focus:bg-white/[0.07]',
            'transition-all duration-200'
          )}
        />
      </div>

      {/* Category Grid */}
      <div className="form-field mb-6">
        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
          Category
        </label>
        <div className="grid grid-cols-4 gap-2">
          {CATEGORY_PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isSelected = category === preset.label;
            
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => setCategory(preset.label)}
                className={cn(
                  'flex flex-col items-center gap-1 p-2 rounded-xl border transition-all duration-200',
                  isSelected
                    ? cn(preset.color, 'border-current')
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/[0.07] hover:text-slate-200'
                )}
              >
                <Icon size={18} />
                <span className="text-[10px] font-medium">{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <button
        ref={buttonRef}
        type="submit"
        disabled={!amount || !label || isSubmitting}
        className={cn(
          'w-full py-3 px-4 rounded-xl',
          'bg-gradient-to-r from-indigo-500 to-fuchsia-500',
          'text-white font-semibold',
          'flex items-center justify-center gap-2',
          'hover:from-indigo-400 hover:to-fuchsia-400',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-all duration-200',
          'shadow-lg shadow-indigo-500/25'
        )}
      >
        <Plus size={20} />
        Add Transaction
      </button>
    </form>
  );
}
