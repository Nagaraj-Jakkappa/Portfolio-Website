import { useEffect, useState } from 'react';

export default function CustomCursor({ settings }) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const mediaQueryPointer = window.matchMedia('(pointer: fine)');
    const mediaQueryMotion = window.matchMedia('(prefers-reduced-motion: no-preference)');

    const canUseCustomCursor =
      settings?.isActive !== false &&
      mediaQueryPointer.matches &&
      mediaQueryMotion.matches &&
      window.innerWidth > 768; // Double check for desktop

    setIsActive(canUseCustomCursor);

    if (canUseCustomCursor) {
      const isValidColor = (c) => /^#([0-9A-F]{3}){1,2}$/i.test(c);
      const color = settings?.color && isValidColor(settings.color) ? settings.color : '#22d3ee';
      
      // Create an SVG arrow cursor with the given color
      const svgCursor = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M4.156 1.488a1 1 0 011.517.067l15 18a1 1 0 01-1.393 1.408l-5.69-3.793-2.616 5.231a1 1 0 01-1.789-.894l2.616-5.232-6.524 1.305a1 1 0 01-1.121-1.09l1-15z" fill="${color}" stroke="#ffffff" stroke-width="1.5" stroke-linejoin="round"/>
        </svg>
      `;
      
      const encodedSvg = encodeURIComponent(svgCursor.trim()).replace(/'/g, "%27").replace(/"/g, "%22");
      const cursorUrl = `url("data:image/svg+xml;charset=utf-8,${encodedSvg}") 4 4`;
      
      document.body.style.setProperty('--custom-cursor-url', cursorUrl);
      document.body.classList.add('custom-cursor-active');
    } else {
      document.body.classList.remove('custom-cursor-active');
      document.body.style.removeProperty('--custom-cursor-url');
    }

    return () => {
      document.body.classList.remove('custom-cursor-active');
      document.body.style.removeProperty('--custom-cursor-url');
    };
  }, [settings?.isActive, settings?.color]);

  return null;
}
