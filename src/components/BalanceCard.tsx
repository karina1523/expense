import { useRef, useEffect } from 'react';
import anime from 'animejs';
import { cn } from '@/utils/cn';
import { NumberOdometer } from './NumberOdometer';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface BalanceCardProps {
  title: string;
  value: number;
  type: 'income' | 'outcome' | 'savings';
  pulseTrigger?: number;
  className?: string;
}

const iconMap = {
  income: TrendingUp,
  outcome: TrendingDown,
  savings: Wallet,
};

const colorMap = {
  income: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    icon: 'text-emerald-400',
    text: 'text-emerald-400',
  },
  outcome: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    icon: 'text-rose-400',
    text: 'text-rose-400',
  },
  savings: {
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    icon: 'text-indigo-400',
    text: 'text-indigo-400',
  },
};

export function BalanceCard({
  title,
  value,
  type,
  pulseTrigger = 0,
  className,
}: BalanceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = iconMap[type];
  const colors = colorMap[type];

  useEffect(() => {
    if (pulseTrigger > 0 && cardRef.current) {
      anime({
        targets: cardRef.current,
        scale: [1, 1.03, 1],
        duration: 400,
        easing: 'easeInOutQuad',
      });
    }
  }, [pulseTrigger]);

  return (
    <div
      ref={cardRef}
      className={cn(
        'relative overflow-hidden rounded-2xl backdrop-blur-xl',
        'bg-white/5 border border-white/10 shadow-2xl',
        'p-6 transition-colors hover:bg-white/[0.07]',
        className
      )}
    >
      {/* Subtle gradient overlay */}
      <div className={cn('absolute inset-0 opacity-30', colors.bg)} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">
            {title}
          </span>
          <div className={cn('p-2 rounded-lg bg-white/5', colors.icon)}>
            <Icon size={20} />
          </div>
        </div>
        
        <div className={cn('text-3xl font-bold tracking-tight', colors.text)}>
          <NumberOdometer value={value} />
        </div>
      </div>

      {/* Decorative border glow */}
      <div className={cn('absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity', colors.border)} 
        style={{ boxShadow: `inset 0 0 20px currentColor` }} 
      />
    </div>
  );
}
