import Link from 'next/link';
import { formatPrice } from '@/data/marquees';
import FavoriteButton from './FavoriteButton';
import CompareButton from './CompareButton';

export default function MarqueeCard({ marquee }) {
  const visibleAmenities = marquee.amenities.slice(0, 3);
  const extraAmenities = Math.max(0, marquee.amenities.length - 3);

  return (
    <div className="theme-card overflow-hidden card-hover group h-full flex flex-col">
      {/* Image */}
      <div className="relative h-44 sm:h-56 overflow-hidden shrink-0">
        <img 
          src={marquee.image} 
          alt={marquee.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {marquee.featured && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-gold-500 text-white text-sm font-semibold rounded-full shadow-lg">
            Featured
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <FavoriteButton slug={marquee.slug} size="sm" />
          <CompareButton slug={marquee.slug} size="sm" />
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full flex items-center shadow-lg">
          <svg className="w-4 h-4 text-gold-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm font-semibold text-gray-700">{marquee.rating}</span>
        </div>

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 flex flex-col flex-1 min-h-0">
        <h3 className="text-lg sm:text-xl font-serif font-semibold text-gray-800 mb-2 group-hover:text-gold-600 transition-colors line-clamp-1">
          {marquee.name}
        </h3>
        
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <svg className="w-4 h-4 mr-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{marquee.location}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {marquee.description}
        </p>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4 py-3 sm:py-4 border-t border-b border-gray-100">
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide">Capacity</p>
            <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
              {marquee.capacity.min}-{marquee.capacity.max} guests
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide">Per Head</p>
            <p className="text-xs sm:text-sm font-semibold text-gold-600 truncate">
              {formatPrice(marquee.pricing.perHead.min)}+
            </p>
          </div>
        </div>

        {/* Amenities — fixed single-row height so cards stay even */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 h-7 overflow-hidden">
          {visibleAmenities.map((amenity, index) => (
            <span 
              key={index}
              title={amenity}
              className="inline-flex items-center h-7 max-w-[6.5rem] sm:max-w-[7.5rem] shrink-0 truncate px-2 sm:px-2.5 bg-gray-100 text-gray-600 text-[11px] sm:text-xs leading-none rounded-full"
            >
              {amenity}
            </span>
          ))}
          {extraAmenities > 0 && (
            <span className="inline-flex items-center h-7 shrink-0 px-2 sm:px-2.5 bg-gold-100 text-gold-700 text-[11px] sm:text-xs leading-none rounded-full">
              +{extraAmenities} more
            </span>
          )}
        </div>

        {/* Actions — pinned to bottom, equal widths */}
        <div className="flex gap-2 sm:gap-3 mt-auto pt-1">
          <Link 
            href={`/marquees/${marquee.slug}`}
            className="flex-1 min-w-0 px-3 sm:px-4 py-2.5 bg-burgundy-700 hover:bg-burgundy-800 text-white text-center font-semibold rounded-lg transition-all text-xs sm:text-sm"
          >
            View Details
          </Link>
          <Link 
            href={`/calculator?venue=${marquee.slug}`}
            className="flex-1 min-w-0 px-3 sm:px-4 py-2.5 border-2 border-gold-500 text-gold-600 hover:bg-gold-50 font-semibold rounded-lg transition-all text-xs sm:text-sm text-center"
          >
            Calculate
          </Link>
        </div>
      </div>
    </div>
  );
}
