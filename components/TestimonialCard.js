import { Star, Quote } from 'lucide-react';
import Link from 'next/link';

export default function TestimonialCard({ testimonial, featured = false }) {
  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-lg transition-all hover:-translate-y-2 hover:shadow-xl ${
      featured ? 'border-2 border-gold-300' : ''
    }`}>
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={testimonial.image}
          alt={testimonial.couple}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-serif text-white">{testimonial.couple}</h3>
          <p className="text-sm text-white/80">{testimonial.venue}</p>
        </div>
        {featured && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-gold-500 text-white text-xs font-semibold rounded-full">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-5 h-5 ${i < testimonial.rating ? 'fill-gold-500 text-gold-500' : 'text-gray-300'}`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-500">{testimonial.date}</span>
        </div>

        {/* Quote */}
        <div className="relative">
          <Quote className="absolute -top-2 -left-2 w-8 h-8 text-gold-200" />
          <p className="text-gray-600 text-sm leading-relaxed pl-4 line-clamp-4">
            {testimonial.review}
          </p>
        </div>

        {/* Details */}
        <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
          <div className="flex gap-4">
            <span className="text-gray-500">
              <span className="font-semibold text-gray-700">{testimonial.guests}</span> guests
            </span>
            <span className="text-gray-500">
              <span className="font-semibold text-gold-600">{testimonial.budget}</span>
            </span>
          </div>
          <Link 
            href={`/marquees/${testimonial.venueSlug}`}
            className="text-burgundy-600 hover:text-burgundy-700 font-medium"
          >
            View Venue →
          </Link>
        </div>

        {/* Highlights */}
        {testimonial.highlights && (
          <div className="mt-4 flex flex-wrap gap-2">
            {testimonial.highlights.map((highlight, i) => (
              <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                {highlight}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
