'use client';

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface SearchButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function SearchButton({ onClick }: SearchButtonProps) {
  const { t } = useHydratedTranslation();

  return (
    <div className="p-4">
      <motion.button
        type="submit"
        onClick={onClick}
        whileHover={{
          boxShadow: "0 4px 12px -2px rgba(59, 130, 246, 0.3)"
        }}
        whileTap={{
          boxShadow: "0 2px 4px -1px rgba(59, 130, 246, 0.2)"
        }}
        className="px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-slate-950 text-white"
      >
        <Search className="w-5 h-5 text-xl" />
        <span className="hidden text-[18px] xl:inline font-semibold tracking-wide">
          {t('search.searchButton', 'Хайх')}
        </span>
      </motion.button>
    </div>
  );
}