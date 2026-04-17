import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { cn } from '@/utils/cn';

interface NumberOdometerProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  duration?: number;
}

export function NumberOdometer({
  value,
  prefix = '$',
  suffix = '',
  decimals = 2,
  className,
  duration = 800,
}: NumberOdometerProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);
  const animationRef = useRef<anime.AnimeInstance | null>(null);

  useEffect(() => {
    const prevValue = prevValueRef.current;
    
    if (prevValue !== value) {
      // Cancel any existing animation
      if (animationRef.current) {
        animationRef.current.pause();
      }

      const animObj = { value: prevValue };
      
      animationRef.current = anime({
        targets: animObj,
        value: value,
        duration,
        easing: 'easeOutExpo',
        update: () => {
          setDisplayValue(animObj.value);
        },
      });

      prevValueRef.current = value;
    }
  }, [value, duration]);

  const formattedValue = displayValue.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className={cn('tabular-nums font-mono', className)}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
}
