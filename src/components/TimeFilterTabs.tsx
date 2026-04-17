import { useRef, useEffect, useState } from 'react';
import anime from 'animejs';
import { cn } from '@/utils/cn';
import type { TimeFilter } from '@/types';

interface TimeFilterTabsProps {
  value: TimeFilter;
  onChange: (filter: TimeFilter) => void;
  className?: string;
}

const FILTERS: { value: TimeFilter; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: '3months', label: '3 Months' },
  { value: 'yearly', label: 'Yearly' },
];

export function TimeFilterTabs({ value, onChange, className }: TimeFilterTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // Update indicator position when value changes
  useEffect(() => {
    if (!containerRef.current) return;
    
    const activeButton = containerRef.current.querySelector(`[data-value="${value}"]`) as HTMLElement;
    if (activeButton && indicatorRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      
      const newLeft = buttonRect.left - containerRect.left;
      const newWidth = buttonRect.width;
      
      // Animate the indicator
      anime({
        targets: indicatorRef.current,
        left: newLeft,
        width: newWidth,
        duration: 300,
        easing: 'easeOutExpo',
      });
      
      setIndicatorStyle({ left: newLeft, width: newWidth });
    }
  }, [value]);

  // Mount animation
  useEffect(() => {
    if (containerRef.current) {
      anime({
        targets: containerRef.current.querySelectorAll('button'),
        translateY: [10, 0],
        opacity: [0, 1],
        duration: 500,
        easing: 'easeOutExpo',
        delay: anime.stagger(50),
      });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative inline-flex p-1 rounded-xl',
        'bg-white/5 border border-white/10',
        className
      )}
    >
      {/* Animated indicator */}
      <div
        ref={indicatorRef}
        className="absolute top-1 bottom-1 rounded-lg bg-white/10 backdrop-blur-sm"
        style={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
      />
      
      {/* Tab buttons */}
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          data-value={filter.value}
          onClick={() => onChange(filter.value)}
          className={cn(
            'relative z-10 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
            value === filter.value ? 'text-white' : 'text-slate-400 hover:text-slate-200'
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
