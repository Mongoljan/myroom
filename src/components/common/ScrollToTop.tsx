'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(24); // 24px = bottom-6

  useEffect(() => {
    const update = () => {
      setVisible(window.scrollY > 300);

      const footer = document.querySelector('footer');
      if (footer) {
        const footerTop = footer.getBoundingClientRect().top;
        const viewportHeight = window.innerHeight;
        if (footerTop < viewportHeight) {
          // Footer is visible — push button up above it
          setBottomOffset(viewportHeight - footerTop + 16);
        } else {
          setBottomOffset(24);
        }
      }
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Дээш гүйлгэх"
      style={{ bottom: `${bottomOffset}px` }}
      className="fixed right-6 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 dark:bg-slate-700 shadow-lg text-white hover:bg-slate-700 dark:hover:bg-slate-600 transition-all duration-200"
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
}
