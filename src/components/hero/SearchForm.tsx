'use client'
import { useState } from "react";
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { motion } from "framer-motion";
import { Search, MapPin, Calendar } from "lucide-react";
import DateRangePicker from "../common/DateRangePicker";
import GuestSelector from "./GuestSelector";

// Utility functions for default dates
const getDefaultCheckInDate = () => {
  return new Date().toISOString().split('T')[0]; // Today
};

const getDefaultCheckOutDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0]; // Tomorrow
};

const SearchForm: React.FC = () => {
  const { t } = useHydratedTranslation();
  const [searchData, setSearchData] = useState({
    location: '',
    checkIn: getDefaultCheckInDate(),
    checkOut: getDefaultCheckOutDate(),
    adults: 2,
    children: 0,
    rooms: 2
  });

  const handleSearch = () => {
    // Use default dates if none are provided
    const checkInDate = searchData.checkIn || getDefaultCheckInDate();
    const checkOutDate = searchData.checkOut || getDefaultCheckOutDate();
    
    const params = new URLSearchParams({
      location: searchData.location,
      check_in: checkInDate,
      check_out: checkOutDate,
      adults: searchData.adults.toString(),
      children: searchData.children.toString(),
      rooms: searchData.rooms.toString(),
      acc_type: 'hotel'
    });

    // Redirect to search page with parameters
    window.location.href = `/search?${params.toString()}`;
  };

  return (
    <motion.div 
      className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto border border-white/20"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          className="md:col-span-1"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <MapPin className="w-4 h-4 mr-1 text-gray-500" />
            {t('search.location', 'Location')}
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchData.location}
              onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
              placeholder={t('search.locationPlaceholder', 'Where are you going?')}
              className="w-full p-3 pl-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 transition-all duration-200"
            />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <DateRangePicker
            label={
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                {t('search.dates', 'Dates')}
              </div>
            }
            checkIn={searchData.checkIn}
            checkOut={searchData.checkOut}
            onDateChange={(checkIn, checkOut) => setSearchData({ ...searchData, checkIn, checkOut })}
            placeholder={t('search.selectDates', 'Check in - Check out')}
          />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <GuestSelector
            adults={searchData.adults}
            childrenCount={searchData.children}
            rooms={searchData.rooms}
            onGuestChange={(adults, children, rooms) => 
              setSearchData({ ...searchData, adults, children, rooms })
            }
          />
        </motion.div>
      </div>

      <div className="mt-6 flex justify-center">
        <motion.button
          onClick={handleSearch}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
        >
          <Search className="w-5 h-5" />
          <span>{t('search.searchButton', 'Search')}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SearchForm;