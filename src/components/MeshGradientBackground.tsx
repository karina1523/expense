import { useEffect, useRef } from 'react';
import anime from 'animejs';

export function MeshGradientBackground() {
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!blob1Ref.current || !blob2Ref.current) return;

    // Animate blob 1
    anime({
      targets: blob1Ref.current,
      translateX: [
        { value: -80, duration: 8000, easing: 'easeInOutSine' },
        { value: 60, duration: 10000, easing: 'easeInOutSine' },
        { value: 0, duration: 7000, easing: 'easeInOutSine' },
      ],
      translateY: [
        { value: -60, duration: 9000, easing: 'easeInOutSine' },
        { value: 80, duration: 8000, easing: 'easeInOutSine' },
        { value: 0, duration: 11000, easing: 'easeInOutSine' },
      ],
      scale: [
        { value: 1.1, duration: 7000, easing: 'easeInOutSine' },
        { value: 0.9, duration: 9000, easing: 'easeInOutSine' },
        { value: 1, duration: 8000, easing: 'easeInOutSine' },
      ],
      loop: true,
    });

    // Animate blob 2
    anime({
      targets: blob2Ref.current,
      translateX: [
        { value: 70, duration: 9000, easing: 'easeInOutSine' },
        { value: -50, duration: 8000, easing: 'easeInOutSine' },
        { value: 0, duration: 10000, easing: 'easeInOutSine' },
      ],
      translateY: [
        { value: 70, duration: 8000, easing: 'easeInOutSine' },
        { value: -60, duration: 10000, easing: 'easeInOutSine' },
        { value: 0, duration: 9000, easing: 'easeInOutSine' },
      ],
      scale: [
        { value: 0.85, duration: 10000, easing: 'easeInOutSine' },
        { value: 1.15, duration: 8000, easing: 'easeInOutSine' },
        { value: 1, duration: 9000, easing: 'easeInOutSine' },
      ],
      loop: true,
    });
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Blob 1 - Indigo */}
      <div
        ref={blob1Ref}
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-[100px]"
      />
      {/* Blob 2 - Fuchsia */}
      <div
        ref={blob2Ref}
        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-fuchsia-500/20 blur-[100px]"
      />
      {/* Subtle noise overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
