import Link from 'next/link';
import { Star, MapPin } from 'lucide-react';
import { formatPrice } from '@/data/marquees';

export default function VendorCard({ vendor }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg card-hover">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={vendor.image} 
          alt={vendor.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        {vendor.featured && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-gold-500 text-white text-sm font-semibold rounded-full">
            Top Rated
          </div>
        )}
        <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full flex items-center">
          <Star className="w-4 h-4 text-gold-500 mr-1 fill-current" />
          <span className="text-sm font-semibold text-gray-700">{vendor.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{vendor.name}</h3>
          <span className="text-xs px-2 py-1 bg-burgundy-100 text-burgundy-700 rounded-full">
            {vendor.type}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{vendor.description}</p>

        {vendor.location && (
          <div className="flex items-center text-gray-500 text-sm mb-4">
            <MapPin className="w-4 h-4 mr-1.5 text-gold-500" />
            {vendor.location}
          </div>
        )}

        {/* Services */}
        <div className="flex flex-wrap gap-2 mb-4">
          {vendor.services.slice(0, 3).map((service, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {service}
            </span>
          ))}
          {vendor.services.length > 3 && (
            <span className="px-2 py-1 bg-gold-100 text-gold-700 text-xs rounded-full">
              +{vendor.services.length - 3} more
            </span>
          )}
        </div>

        {/* Price & Reviews */}
        <div className="flex items-center justify-between py-3 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Starting from</p>
            <p className="text-lg font-bold text-gold-600">
              {formatPrice(vendor.priceRange.min)}
              {vendor.priceType && <span className="text-xs font-normal text-gray-500">/{vendor.priceType}</span>}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Reviews</p>
            <p className="text-lg font-semibold text-gray-700">{vendor.reviews}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <Link 
            href={`/vendors/${vendor.slug}`}
            className="flex-1 px-4 py-2.5 bg-burgundy-700 hover:bg-burgundy-800 text-white text-center font-semibold rounded-lg transition-all text-sm"
          >
            View Profile
          </Link>
          <a 
            href={`tel:${vendor.contact.phone}`}
            className="px-4 py-2.5 border-2 border-gold-500 text-gold-600 hover:bg-gold-50 font-semibold rounded-lg transition-all text-sm"
          >
            Call
          </a>
        </div>
      </div>
    </div>
  );
}
