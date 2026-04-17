import { useEffect, useRef, useMemo } from 'react';
import anime from 'animejs';
import { cn } from '@/utils/cn';
import type { Transaction } from '@/types';

interface SpendingBreakdownProps {
  transactions: Transaction[];
  className?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Shopping': '#f43f5e',
  'Bills': '#f59e0b',
  'Food': '#10b981',
  'Salary': '#6366f1',
  'Entertainment': '#8b5cf6',
  'Transport': '#06b6d4',
  'Health': '#ec4899',
  'Other': '#64748b',
};

export function SpendingBreakdown({ transactions, className }: SpendingBreakdownProps) {
  const ringsRef = useRef<SVGCircleElement[]>([]);
  
  // Calculate category breakdown for expenses only
  const categoryData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'outcome');
    const total = expenses.reduce((sum, t) => sum + t.amount, 0);
    
    const categories: Record<string, number> = {};
    expenses.forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });

    return Object.entries(categories)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
        color: CATEGORY_COLORS[category] || CATEGORY_COLORS['Other'],
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  // Calculate ring segments
  const rings = useMemo(() => {
    const total = categoryData.reduce((sum, c) => sum + c.amount, 0);
    let accumulatedPercentage = 0;
    
    return categoryData.map((cat, index) => {
      const percentage = total > 0 ? (cat.amount / total) * 100 : 0;
      const startAngle = (accumulatedPercentage / 100) * 360;
      accumulatedPercentage += percentage;
      const endAngle = (accumulatedPercentage / 100) * 360;
      
      return {
        ...cat,
        index,
        startAngle,
        endAngle,
        percentage,
      };
    });
  }, [categoryData]);

  // Animate rings on data change
  useEffect(() => {
    ringsRef.current.forEach((ring, i) => {
      if (!ring) return;
      const circumference = 2 * Math.PI * (70 - i * 12);
      const segment = rings[i];
      if (!segment) return;
      
      const targetOffset = circumference * (1 - segment.percentage / 100);
      
      anime({
        targets: ring,
        strokeDashoffset: [circumference, targetOffset],
        duration: 1000,
        easing: 'easeOutExpo',
        delay: i * 150,
      });
    });
  }, [rings]);

  if (rings.length === 0) {
    return (
      <div className={cn(
        'flex flex-col items-center justify-center rounded-2xl backdrop-blur-xl',
        'bg-white/5 border border-white/10 shadow-2xl p-8',
        className
      )}>
        <p className="text-slate-400 text-sm">No expense data</p>
      </div>
    );
  }

  return (
    <div className={cn(
      'rounded-2xl backdrop-blur-xl',
      'bg-white/5 border border-white/10 shadow-2xl p-6',
      className
    )}>
      <h3 className="text-lg font-semibold text-white mb-6">Spending Breakdown</h3>
      
      <div className="flex flex-col items-center">
        {/* SVG Rings */}
        <svg width="180" height="180" viewBox="0 0 180 180" className="mb-6">
          {rings.map((ring, i) => {
            const radius = 70 - i * 12;
            const circumference = 2 * Math.PI * radius;
            const strokeWidth = 8;
            
            return (
              <circle
                key={ring.category}
                ref={(el) => {
                  if (el) ringsRef.current[i] = el;
                }}
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke={ring.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference}
                transform="rotate(-90 90 90)"
                className="drop-shadow-lg"
              />
            );
          })}
          
          {/* Center text */}
          <text x="90" y="85" textAnchor="middle" className="fill-slate-400 text-xs">
            Total Spent
          </text>
          <text x="90" y="105" textAnchor="middle" className="fill-white text-lg font-bold">
            ${categoryData.reduce((s, c) => s + c.amount, 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </text>
        </svg>

        {/* Legend */}
        <div className="w-full space-y-3">
          {rings.map((ring) => (
            <div key={ring.category} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: ring.color }}
                />
                <span className="text-sm text-slate-300">{ring.category}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400">
                  {ring.percentage.toFixed(1)}%
                </span>
                <span className="text-sm font-medium text-white w-16 text-right">
                  ${ring.amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
