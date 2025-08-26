"use client";
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import Link from 'next/link';

export default function PopularDestinations() {
  useHydratedTranslation();

  const destinations = [
    { name: 'New York', image: '/img/destinations/new-york.jpg' },
    { name: 'London', image: '/img/destinations/london.jpg' },
    { name: 'Barcelona', image: '/img/destinations/barcelona.jpg' },
    { name: 'Sydney', image: '/img/destinations/sydney.jpg' },
    { name: 'Rome', image: '/img/destinations/rome.jpg' },
  ];

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Popular Destinations</h2>
            <p className="text-sm text-gray-600">These popular destinations have a lot to offer</p>
          </div>
          <Link 
            href="/destinations" 
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
          >
            View All Destinations
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {destinations.map((destination, index) => (
            <Link
              key={index}
              href={`/destinations/${destination.name.toLowerCase().replace(' ', '-')}`}
              className="group relative overflow-hidden rounded-lg aspect-[3/4] bg-gray-200"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
              <div className="absolute bottom-3 left-3 right-3 z-20">
                <h3 className="text-white font-medium text-sm">{destination.name}</h3>
              </div>
              <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                <span className="text-gray-500 text-sm">451x600</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}