import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({ rating = 5, totalStars = 5, size = 'md', interactive = false, onRatingChange }) => {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(totalStars)].map((_, i) => {
        const starNumber = i + 1;
        const isFilled = starNumber <= rating;
        return (
          <button
            type="button"
            key={i}
            disabled={!interactive}
            onClick={() => interactive && onRatingChange && onRatingChange(starNumber)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          >
            <Star
              className={`${sizeClasses[size] || sizeClasses.md} ${
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-slate-200 text-slate-300'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default RatingStars;
