'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, MapPin, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { TYPOGRAPHY } from '@/styles/containers';

interface RecentHotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
}

export default function RecentlyViewed() {
  const [recentHotels, setRecentHotels] = useState<RecentHotel[]>([]);

  useEffect(() => {
    const mockRecentHotels: RecentHotel[] = [
      {
        id: '1',
        name: 'ART HOTEL Наула',
        location: 'Улаанбаатар, Монгол',
        rating: 4.8,
        price: 250000,
        originalPrice: 320000,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
        badge: 'NEW'
      },
      {
        id: '2', 
        name: 'ART HOTEL Наула',
        location: 'Улаанбаатар, Монгол',
        rating: 4.7,
        price: 180000,
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
        badge: 'BEST SELLER'
      },
      {
        id: '3',
        name: 'Hotel Степант Дэнгэдэлуул-1',
        location: 'Улаанбаатар, Монгол',
        rating: 4.9,
        price: 420000,
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
        badge: 'TOP RATED'
      },
      {
        id: '4',
        name: 'RED PANDA HOUSE',
        location: 'Улаанбаатар, Монгол',
        rating: 4.6,
        price: 150000,
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400'
      }
    ];
    setRecentHotels(mockRecentHotels);
  }, []);

  const removeFromRecent = (hotelId: string) => {
    setRecentHotels(prev => prev.filter(hotel => hotel.id !== hotelId));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('mn-MN').format(price);
  };

  if (recentHotels.length === 0) {
    return null;
  }

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h2 className={`${TYPOGRAPHY.heading.h1} text-gray-900 mb-2`}>
              Сүүлд үзсэн
            </h2>
            <p className={`${TYPOGRAPHY.body.standard} text-gray-600`}>
              Сайн орж үзсэн бүгдэд модэлчилгэг 10 дотор харагдана.
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full border border-gray-200 hover:border-gray-300 transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-full border border-gray-200 hover:border-gray-300 transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentHotels.map((hotel, index) => (
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <button
                onClick={() => removeFromRecent(hotel.id)}
                className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>

              {hotel.badge && (
                <div className="absolute top-3 left-3 z-10">
                  <span className={`px-2 py-1 ${TYPOGRAPHY.card.badge} rounded-full ${
                    hotel.badge === 'NEW' ? 'bg-green-500 text-white' :
                    hotel.badge === 'BEST SELLER' ? 'bg-orange-500 text-white' :
                    hotel.badge === 'TOP RATED' ? 'bg-purple-500 text-white' :
                    'bg-blue-500 text-white'
                  }`}>
                    {hotel.badge}
                  </span>
                </div>
              )}

              <Link href={`/hotel/${hotel.id}`}>
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={hotel.image}
                    alt={hotel.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <div className="p-4">
                  <h3 className={`${TYPOGRAPHY.card.title} text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors`}>
                    {hotel.name}
                  </h3>
                  
                  <div className={`flex items-center ${TYPOGRAPHY.body.caption} text-gray-500 mb-3`}>
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="line-clamp-1">{hotel.location}</span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className={`ml-1 ${TYPOGRAPHY.body.small} text-gray-900`}>
                        {hotel.rating}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`${TYPOGRAPHY.card.price} text-gray-900`}>
                          ₮{formatPrice(hotel.price)}
                        </span>
                        {hotel.originalPrice && (
                          <span className={`${TYPOGRAPHY.body.caption} text-gray-500 line-through`}>
                            ₮{formatPrice(hotel.originalPrice)}
                          </span>
                        )}
                      </div>
                      <span className={`${TYPOGRAPHY.body.caption} text-gray-500`}>шөнөтэй</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-10"
        >
          <button className={`inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-200 ${TYPOGRAPHY.button.standard}`}>
            Бүгдийг харах
          </button>
        </motion.div>
      </div>
    </section>
  );
}