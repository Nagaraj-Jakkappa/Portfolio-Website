import { useEffect, useRef, useState } from 'react';

export default function CustomCursor({ settings }) {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const requestRef = useRef(null);

  // Use refs for positions to avoid re-renders on mousemove
  const mouse = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  
  const isHovering = useRef(false);

  useEffect(() => {
    // Check if the device has a fine pointer (mouse) and no reduced motion preference
    const mediaQueryPointer = window.matchMedia('(pointer: fine)');
    const mediaQueryMotion = window.matchMedia('(prefers-reduced-motion: no-preference)');

    const canUseCustomCursor =
      settings?.isActive !== false &&
      mediaQueryPointer.matches &&
      mediaQueryMotion.matches &&
      window.innerWidth > 768; // Double check for desktop

    setIsActive(canUseCustomCursor);

    if (canUseCustomCursor) {
      document.body.classList.add('custom-cursor-active');
    } else {
      document.body.classList.remove('custom-cursor-active');
    }

    return () => {
      document.body.classList.remove('custom-cursor-active');
    };
  }, [settings?.isActive]);

  useEffect(() => {
    if (!isActive) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      
      // Update dot immediately for responsiveness
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const updateRing = () => {
      // Smooth follow for the ring
      const dx = mouse.current.x - ring.current.x;
      const dy = mouse.current.y - ring.current.y;
      
      // Speed factor
      ring.current.x += dx * 0.15;
      ring.current.y += dy * 0.15;

      if (ringRef.current) {
        // Apply transform and conditionally add scale based on hover state
        const scale = isHovering.current ? 'scale(1.5)' : 'scale(1)';
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) ${scale}`;
      }

      requestRef.current = requestAnimationFrame(updateRing);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const isInteractive =
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.closest('.card-hover');
        
      isHovering.current = !!isInteractive;
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    
    // Start animation loop
    requestRef.current = requestAnimationFrame(updateRing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isActive]);

  if (!isActive) return null;

  const color = settings?.color || '#22d3ee';

  return (
    <div 
      className="pointer-events-none fixed inset-0 z-[9999]" 
      aria-label={settings?.label || 'Premium Cursor'}
    >
      {/* Center Dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full pointer-events-none"
        style={{ backgroundColor: color }}
      />
      {/* Outer Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 rounded-full border border-solid pointer-events-none transition-[transform,border-color] duration-100 ease-out"
        style={{ borderColor: `${color}80`, backgroundColor: `${color}10` }}
      />
    </div>
  );
}
