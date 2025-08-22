"use client";
import React, { createContext, useContext, useState } from "react";

interface TranslationContextType {
  t: (key: string) => string;
  currentLanguage: string;
  setLanguage: (lang: string) => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

const translations = {
  en: {
    "navigation.becomeExpert": "Become An Expert",
    "navigation.signInRegister": "Sign In / Register",
    "hero.title": "Find Next Place To Visit",
    "hero.subtitle": "Discover amazing places at exclusive deals",
    "search.location": "Location",
    "search.locationPlaceholder": "Where are you going?",
    "search.checkIn": "Check in",
    "search.checkOut": "Check out",
    "search.guest": "Guest",
    "search.adults": "Adults",
    "search.children": "Children",
    "search.rooms": "Rooms",
    "search.searchButton": "Search",
    "tabs.hotels": "Hotels",
    "tabs.tour": "Tour",
    "tabs.activity": "Activity",
    "tabs.holidayRentals": "Holiday Rentals",
    "tabs.car": "Car",
    "tabs.cruise": "Cruise",
    "tabs.flights": "Flights",
  },
};

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState("en");

  const t = (key: string): string => {
    return (
      translations[currentLanguage as keyof typeof translations]?.[
        key as keyof typeof translations.en
      ] || key
    );
  };

  const setLanguage = (lang: string) => {
    setCurrentLanguage(lang);
  };

  return (
    <TranslationContext.Provider value={{ t, currentLanguage, setLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};
