import Link from 'next/link';
import { Heart, Phone, Mail, MapPin, Instagram, Facebook, Twitter, Youtube, Send, ArrowUp } from 'lucide-react';
import { useState } from 'react';
import { useWedding } from '@/context/WeddingContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { showNotification } = useWedding();
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      showNotification('Thank you for subscribing! 💌', 'success');
      setEmail('');
    }
  };
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white relative">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-burgundy-700 to-burgundy-900 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-serif text-white mb-2">Get Wedding Inspiration</h3>
              <p className="text-white/70">Subscribe for tips, trends, and exclusive offers</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 md:w-80 px-4 py-3 rounded-l-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-gold-400"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-r-lg transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-serif text-2xl">W</span>
              </div>
              <div>
                <h3 className="font-serif text-2xl">Lahore Elite</h3>
                <p className="text-sm text-gold-400 -mt-1">Weddings</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted partner in planning the perfect wedding. Discover Lahore's finest venues and services for your special day.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-gold-500 rounded-lg flex items-center justify-center transition-colors group">
                <Facebook className="w-5 h-5 text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-gold-500 rounded-lg flex items-center justify-center transition-colors group">
                <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-gold-500 rounded-lg flex items-center justify-center transition-colors group">
                <Twitter className="w-5 h-5 text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-gold-500 rounded-lg flex items-center justify-center transition-colors group">
                <Youtube className="w-5 h-5 text-gray-400 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-5 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/marquees" className="text-gray-400 hover:text-gold-400 transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-2"></span>
                  Browse Venues
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-gray-400 hover:text-gold-400 transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-2"></span>
                  Budget Calculator
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-gray-400 hover:text-gold-400 transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-2"></span>
                  Compare Venues
                </Link>
              </li>
              <li>
                <Link href="/vendors" className="text-gray-400 hover:text-gold-400 transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-2"></span>
                  Find Vendors
                </Link>
              </li>
              <li>
                <Link href="/checklist" className="text-gray-400 hover:text-gold-400 transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-2"></span>
                  Planning Checklist
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-400 hover:text-gold-400 transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-2"></span>
                  Photo Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Areas */}
          <div>
            <h4 className="font-semibold text-lg mb-5 text-white">Popular Areas</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/marquees?area=Mall Road" className="text-gray-400 hover:text-gold-400 transition-colors flex items-center">
                  <MapPin className="w-3 h-3 mr-2 text-gold-500" />
                  Mall Road
                </Link>
              </li>
              <li>
                <Link href="/marquees?area=Gulberg" className="text-gray-400 hover:text-gold-400 transition-colors flex items-center">
                  <MapPin className="w-3 h-3 mr-2 text-gold-500" />
                  Gulberg
                </Link>
              </li>
              <li>
                <Link href="/marquees?area=DHA" className="text-gray-400 hover:text-gold-400 transition-colors flex items-center">
                  <MapPin className="w-3 h-3 mr-2 text-gold-500" />
                  DHA
                </Link>
              </li>
              <li>
                <Link href="/marquees?area=Cantt" className="text-gray-400 hover:text-gold-400 transition-colors flex items-center">
                  <MapPin className="w-3 h-3 mr-2 text-gold-500" />
                  Cantt
                </Link>
              </li>
              <li>
                <Link href="/marquees?area=Bahria Town" className="text-gray-400 hover:text-gold-400 transition-colors flex items-center">
                  <MapPin className="w-3 h-3 mr-2 text-gold-500" />
                  Bahria Town
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-5 text-white">Contact Us</h4>
            <ul className="space-y-4 text-gray-400">
              <li>
                <a href="tel:+923001234567" className="flex items-center hover:text-gold-400 transition-colors">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mr-3">
                    <Phone className="w-4 h-4 text-gold-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Call us</p>
                    <p>+92 300 1234567</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:info@lahoreeliteweddings.pk" className="flex items-center hover:text-gold-400 transition-colors">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mr-3">
                    <Mail className="w-4 h-4 text-gold-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email us</p>
                    <p className="text-sm">info@lahoreeliteweddings.pk</p>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mr-3">
                    <MapPin className="w-4 h-4 text-gold-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p>Lahore, Pakistan</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Lahore Elite Weddings. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="#" className="hover:text-gold-400 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-gold-400 transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-gold-400 transition-colors">FAQs</Link>
            </div>
            <p className="text-gray-500 text-sm flex items-center">
              Made with <Heart className="w-4 h-4 text-red-500 mx-1 fill-red-500 animate-heartBeat" /> for beautiful weddings
            </p>
          </div>
        </div>
      </div>
      
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 w-12 h-12 bg-gold-500 hover:bg-gold-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-40"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </footer>
  );
}
