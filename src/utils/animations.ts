import anime from 'animejs';

// Mount sequence animation for cards
export const animateMountSequence = (selector: string, delay: number = 0) => {
  return anime({
    targets: selector,
    translateY: [40, 0],
    opacity: [0, 1],
    duration: 800,
    easing: 'easeOutExpo',
    delay: anime.stagger(100, { start: delay }),
  });
};

// Pulse effect for balance card
export const animatePulse = (target: HTMLElement | string) => {
  return anime({
    targets: target,
    scale: [1, 1.03, 1],
    duration: 400,
    easing: 'easeInOutQuad',
  });
};

// Number counter animation (odometer effect)
export const animateNumber = (
  _target: HTMLElement | string,
  from: number,
  to: number,
  duration: number = 800,
  callback?: (value: number) => void
) => {
  const animObj = { value: from };
  
  return anime({
    targets: animObj,
    value: to,
    duration,
    easing: 'easeOutExpo',
    update: () => {
      if (callback) {
        callback(animObj.value);
      }
    },
  });
};

// Hover shift animation for list items
export const animateHoverShift = (target: HTMLElement | string, direction: 'in' | 'out') => {
  return anime({
    targets: target,
    translateX: direction === 'in' ? 8 : 0,
    duration: 200,
    easing: 'easeOutQuad',
  });
};

// @ts-ignore - Unused parameter kept for API consistency
export const animateHoverShiftLegacy = (_target: HTMLElement | string, _direction: 'in' | 'out') => {
  // Legacy function - kept for compatibility
};

// SVG ring animation
export const animateRing = (
  target: SVGCircleElement | string,
  fromOffset: number,
  toOffset: number,
  duration: number = 1000
) => {
  return anime({
    targets: target,
    strokeDashoffset: [fromOffset, toOffset],
    duration,
    easing: 'easeOutExpo',
  });
};

// Mesh gradient blob animation
export const animateBlob = (target: HTMLElement | string, delay: number = 0) => {
  return anime({
    targets: target,
    translateX: () => anime.random(-100, 100),
    translateY: () => anime.random(-100, 100),
    scale: [1, 1.2, 1],
    duration: 15000,
    easing: 'easeInOutSine',
    direction: 'alternate',
    loop: true,
    delay,
  });
};

// Tab switch animation
export const animateTabSwitch = (selector: string) => {
  return anime({
    targets: selector,
    opacity: [0, 1],
    translateY: [10, 0],
    duration: 400,
    easing: 'easeOutQuad',
  });
};

// Delete item animation
export const animateDelete = (target: HTMLElement | string, onComplete?: () => void) => {
  return anime({
    targets: target,
    translateX: [0, -100],
    opacity: [1, 0],
    height: [anime.get(target, 'height', 'px'), 0],
    marginBottom: [anime.get(target, 'marginBottom', 'px'), 0],
    padding: [anime.get(target, 'padding', 'px'), 0],
    duration: 400,
    easing: 'easeInOutQuad',
    complete: onComplete,
  });
};
