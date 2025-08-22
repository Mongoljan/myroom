'use client';

import { useState, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';

interface Hotel {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  lat: number;
  lng: number;
}

interface MapViewProps {
  hotels: Hotel[];
  selectedHotel?: Hotel | null;
  onHotelSelect: (hotel: Hotel | null) => void;
}

export default function MapView({ hotels, selectedHotel, onHotelSelect }: MapViewProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => setIsLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
      {/* Mock Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 400 300">
            {/* Mock map paths */}
            <path d="M50 50 Q100 30 150 50 T250 50" stroke="#4A90E2" strokeWidth="2" fill="none" />
            <path d="M100 100 Q150 80 200 100 T300 100" stroke="#4A90E2" strokeWidth="2" fill="none" />
            <path d="M75 150 Q125 130 175 150 T275 150" stroke="#4A90E2" strokeWidth="2" fill="none" />
          </svg>
        </div>
      </div>

      {/* Hotel Markers */}
      {hotels.map((hotel, index) => (
        <div
          key={hotel.id}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
            selectedHotel?.id === hotel.id ? 'z-20 scale-110' : 'z-10'
          }`}
          style={{
            left: `${20 + (index % 4) * 20}%`,
            top: `${30 + Math.floor(index / 4) * 25}%`,
          }}
          onClick={() => onHotelSelect(hotel)}
        >
          <div className={`
            px-3 py-2 rounded-lg shadow-lg text-sm font-medium transition-all
            ${selectedHotel?.id === hotel.id 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-white text-foreground hover:bg-primary hover:text-primary-foreground'
            }
          `}>
            ${hotel.price}
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-current"></div>
        </div>
      ))}

      {/* Selected Hotel Info */}
      {selectedHotel && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 z-30">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{selectedHotel.name}</h3>
              <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
                <MapPin className="w-3 h-3" />
                <span>{selectedHotel.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm font-medium ml-1">{selectedHotel.rating}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">${selectedHotel.price}</div>
                  <div className="text-sm text-muted-foreground">per night</div>
                </div>
              </div>
            </div>
            <button
              onClick={() => onHotelSelect(null)}
              className="ml-4 p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button className="bg-white p-2 rounded shadow hover:bg-gray-50">
          <span className="text-lg font-bold">+</span>
        </button>
        <button className="bg-white p-2 rounded shadow hover:bg-gray-50">
          <span className="text-lg font-bold">−</span>
        </button>
      </div>
    </div>
  );
}