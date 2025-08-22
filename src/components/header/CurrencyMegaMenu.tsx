'use client'
import { useState } from "react";

interface CurrencyMegaMenuProps {
  textClass?: string;
}

const CurrencyMegaMenu: React.FC<CurrencyMegaMenuProps> = ({ textClass = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'MNT', symbol: '₮', name: 'Mongolian Tugrik' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-1 ${textClass} hover:text-blue-400 transition-colors`}
      >
        <span>{selectedCurrency}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[150px]">
          {currencies.map((currency) => (
            <button
              key={currency.code}
              onClick={() => {
                setSelectedCurrency(currency.code);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-900">{currency.code}</span>
                <span className="text-gray-600">{currency.symbol}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencyMegaMenu;