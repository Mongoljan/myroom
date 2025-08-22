'use client'
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar } from "lucide-react";
import DatePicker from "./DatePicker";
import GuestSelector from "./GuestSelector";

const SearchForm: React.FC = () => {
  const { t } = useTranslation();
  const [searchData, setSearchData] = useState({
    location: '',
    checkIn: '2025-09-01',
    checkOut: '2025-09-03',
    adults: 2,
    children: 0,
    rooms: 2
  });

  const handleSearch = () => {
    const params = new URLSearchParams({
      location: searchData.location,
      check_in: searchData.checkIn,
      check_out: searchData.checkOut,
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
      className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto border border-white/20"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div 
          className="md:col-span-1"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {t('search.location')}
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchData.location}
              onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
              placeholder={t('search.locationPlaceholder')}
              className="w-full p-3 pl-4 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200"
            />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <DatePicker
            label={
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {t('search.checkIn')}
              </div>
            }
            value={searchData.checkIn}
            onChange={(date) => setSearchData({ ...searchData, checkIn: date })}
            placeholder="Add date"
          />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <DatePicker
            label={
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {t('search.checkOut')}
              </div>
            }
            value={searchData.checkOut}
            onChange={(date) => setSearchData({ ...searchData, checkOut: date })}
            placeholder="Add date"
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
          <span>{t('search.searchButton')}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SearchForm;