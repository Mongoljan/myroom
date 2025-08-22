'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CustomGuestSelector from '@/components/search/CustomGuestSelector';

export default function ModernHero() {
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(1);
  const [rooms, setRooms] = useState(1);
  const router = useRouter();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams({
      location: destination,
      check_in: checkIn,
      check_out: checkOut,
      adults: adults.toString(),
      children: children.toString(),
      rooms: rooms.toString(),
    });
    router.push(`/search?${params.toString()}`);
  };

  const handleGuestChange = (newAdults: number, newChildren: number, newRooms: number) => {
    setAdults(newAdults);
    setChildren(newChildren);
    setRooms(newRooms);
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, white 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 70, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Find Your Perfect
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Hotel Stay
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Discover exceptional hotels worldwide with instant booking, 
              real-time availability, and unmatched experiences.
            </motion.p>
          </motion.div>

          {/* Modern Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex flex-col lg:flex-row items-center divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
                
                {/* Location */}
                <div className="flex-1 p-6 w-full">
                  <div className="flex items-center">
                    <MapPin className="w-6 h-6 text-gray-400 mr-4" />
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Location</div>
                      <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="Where are you going?"
                        className="w-full text-gray-900 placeholder-gray-400 border-none outline-none text-lg font-medium"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Check-in Check-out */}
                <div className="lg:flex-1 p-6 w-full">
                  <div className="flex items-center">
                    <Calendar className="w-6 h-6 text-gray-400 mr-4" />
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Check in - Check out</div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="date"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="text-gray-900 border-none outline-none text-lg font-medium"
                          required
                        />
                        <input
                          type="date"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          min={checkIn || new Date().toISOString().split('T')[0]}
                          className="text-gray-900 border-none outline-none text-lg font-medium"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guests */}
                <div className="lg:flex-1 w-full">
                  <CustomGuestSelector
                    adults={adults}
                    childrenCount={children}
                    rooms={rooms}
                    onGuestChange={handleGuestChange}
                  />
                </div>

                {/* Search Button */}
                <div className="p-3">
                  <motion.button
                    onClick={handleSearch}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl transition-colors flex items-center gap-2"
                  >
                    <Search className="w-6 h-6" />
                    <span className="hidden xl:inline">Search</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto"
          >
            {[
              { number: '10,000+', label: 'Hotels Worldwide' },
              { number: '50,000+', label: 'Happy Customers' },
              { number: '24/7', label: 'Customer Support' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}