'use client';

import { useState } from 'react';
import { Star, ThumbsUp, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
}

// Mock reviews data
const mockReviews: Review[] = [
  {
    id: '1',
    userName: 'John D.',
    rating: 5,
    date: '2024-01-15',
    comment: 'Absolutely fantastic stay! The staff was incredibly friendly and the room was spotless. The location is perfect for exploring the city.',
    helpful: 12
  },
  {
    id: '2',
    userName: 'Sarah M.',
    rating: 4,
    date: '2024-01-10',
    comment: 'Great hotel with excellent amenities. The pool area was beautiful and the breakfast was delicious. Only minor issue was the WiFi speed.',
    helpful: 8
  },
  {
    id: '3',
    userName: 'Mike R.',
    rating: 5,
    date: '2024-01-05',
    comment: 'Outstanding service and beautiful rooms. The concierge helped us plan our entire itinerary. Will definitely stay here again!',
    helpful: 15
  }
];

interface HotelReviewsProps {
  hotelId?: string;
  rating: number;
  reviewCount: number;
}

export default function HotelReviews({ rating, reviewCount }: Omit<HotelReviewsProps, 'hotelId'>) {
  const { t } = useTranslation();
  const [reviews] = useState<Review[]>(mockReviews);
  const [showAll, setShowAll] = useState(false);

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  const getRatingText = (rating: number) => {
    if (rating >= 4.5) return t('hotel.excellent');
    if (rating >= 4.0) return t('hotel.veryGood');
    if (rating >= 3.5) return t('hotel.good');
    if (rating >= 3.0) return t('hotel.fair');
    return t('hotel.poor');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{t('hotel.reviews')}</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="text-xl font-bold">{rating}</span>
          </div>
          <div className="text-muted-foreground">
            <span className="font-medium">{getRatingText(rating)}</span>
            <span className="ml-1">({reviewCount} {t('hotel.reviews')})</span>
          </div>
        </div>
      </div>

      {/* Rating Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-muted/30 rounded-lg">
        {[
          { label: 'Cleanliness', rating: 4.8 },
          { label: 'Service', rating: 4.7 },
          { label: 'Location', rating: 4.9 },
          { label: 'Value', rating: 4.6 },
          { label: 'Facilities', rating: 4.5 }
        ].map((item, index) => (
          <div key={index} className="text-center">
            <div className="text-lg font-semibold">{item.rating}</div>
            <div className="text-sm text-muted-foreground">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {displayedReviews.map((review) => (
          <div key={review.id} className="border-b border-border pb-6 last:border-b-0">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{review.userName}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span>•</span>
                      <span>{formatDate(review.date)}</span>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground mb-3 leading-relaxed">
                  {review.comment}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span>Helpful ({review.helpful})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      {reviews.length > 3 && (
        <div className="text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 border border-border rounded-md hover:bg-muted/50 transition-colors"
          >
            {showAll ? 'Show Less' : `Show All ${reviews.length} Reviews`}
          </button>
        </div>
      )}
    </div>
  );
}