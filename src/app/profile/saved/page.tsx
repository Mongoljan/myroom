"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Star } from 'lucide-react';

interface SavedHotel {
  id: number;
  name: string;
  city: string;
  district: string;
  stars: number;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  nights: number;
  available: boolean;
  amenity?: string;
  remainingRooms?: number;
  slug?: string;
}

const SAVED_KEY = 'myroom_saved_hotels';

function loadSaved(): SavedHotel[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
  } catch {
    return [];
  }
}

function removeSaved(id: number) {
  const current = loadSaved();
  localStorage.setItem(SAVED_KEY, JSON.stringify(current.filter((h) => h.id !== id)));
}

export default function SavedPage() {
  const [hotels, setHotels] = useState<SavedHotel[]>([]);
  const [activeCity, setActiveCity] = useState<string>('');

  useEffect(() => {
    const saved = loadSaved();
    setHotels(saved);
    if (saved.length > 0) setActiveCity(saved[0].city);
  }, []);

  const cities = Array.from(new Set(hotels.map((h) => h.city)));
  const filtered = activeCity ? hotels.filter((h) => h.city === activeCity) : hotels;

  const cityCount = (city: string) => hotels.filter((h) => h.city === city).length;

  const handleRemove = (id: number) => {
    removeSaved(id);
    setHotels(loadSaved());
  };

  const formatPrice = (p: number) => p.toLocaleString('mn-MN') + ' ₮';

  if (hotels.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="mb-6 pb-4 border-b border-gray-100">
          <h1 className="text-xl font-semibold text-gray-900">Хадгалсан</h1>
        </div>
        <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
          <Heart size={40} className="text-gray-200" />
          <p className="text-sm">Хадгалсан буудал байхгүй байна.</p>
          <Link
            href="/search"
            className="mt-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition"
          >
            Буудал хайх
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-6 pt-6 pb-0">
        <h1 className="text-xl font-semibold text-gray-900 mb-5">Хадгалсан</h1>

        {/* City tabs */}
        <div className="flex gap-1 overflow-x-auto border-b border-gray-100 pb-0.5 mb-5">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setActiveCity(city)}
              className={`px-4 py-2 text-sm whitespace-nowrap transition border-b-2 -mb-0.5 ${
                activeCity === city
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {city}({cityCount(city)})
            </button>
          ))}
        </div>
      </div>

      {/* Hotel grid */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((hotel) => (
          <div key={hotel.id} className="border border-gray-200 rounded-xl overflow-hidden group">
            {/* Image area */}
            <div className="relative h-40 bg-gray-100">
              <button
                onClick={() => handleRemove(hotel.id)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center z-10 hover:bg-red-50 transition"
              >
                <Heart size={16} className="text-red-500 fill-red-500" />
              </button>
            </div>

            {/* Info */}
            <div className="p-3">
              <h3 className="text-sm font-semibold text-gray-900">{hotel.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {hotel.city}, {hotel.district}
              </p>

              {/* Stars */}
              <div className="flex items-center gap-0.5 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={11}
                    className={i < hotel.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="text-xs font-semibold text-blue-600">{hotel.rating}/5</span>
                <span className="text-xs text-gray-400">{hotel.reviewCount} сэтгэгдэл</span>
              </div>

              {hotel.amenity && (
                <p className="text-xs text-green-600 mt-1">{hotel.amenity}</p>
              )}

              {/* Price */}
              <div className="mt-2">
                {!hotel.available ? (
                  <p className="text-xs text-red-500">
                    Сайт дээрх бүх өрөө зарагдаж дууссан байна.
                  </p>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      {hotel.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatPrice(hotel.originalPrice)}
                        </span>
                      )}
                      {hotel.discount && (
                        <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded font-medium">
                          -{hotel.discount}%
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-bold text-blue-600 mt-0.5">
                      {formatPrice(hotel.price)}
                    </div>
                    <p className="text-xs text-gray-400">
                      Нийт үнэ: {formatPrice(hotel.price * hotel.nights)}
                    </p>
                    <p className="text-xs text-gray-400">
                      1 өрөө x {hotel.nights} шөнө (НӨАТ багтсан)
                    </p>
                    {hotel.remainingRooms && (
                      <p className="text-xs text-red-500 font-medium mt-0.5">
                        Сүүлийн {hotel.remainingRooms} өрөө
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
