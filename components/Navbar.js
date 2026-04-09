import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useWedding } from '@/context/WeddingContext';
import { Search, Heart, Calendar, Menu, X, ChevronDown, Sparkles, GitCompare, ListChecks, Camera, Users, Star } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(null);
  const { setIsSearchOpen, favorites, weddingDate, getDaysUntilWedding, compareList } = useWedding();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [router.pathname]);

  const daysLeft = getDaysUntilWedding();

  const navLinks = [
    { 
      name: 'Venues', 
      href: '/marquees',
      dropdown: [
        { name: 'All Marquees', href: '/marquees', icon: <Sparkles className="w-4 h-4" /> },
        { name: 'Compare Venues', href: '/compare', icon: <GitCompare className="w-4 h-4" /> },
        { name: 'Gallery', href: '/gallery', icon: <Camera className="w-4 h-4" /> },
      ]
    },
    { 
      name: 'Planning', 
      href: '/calculator',
      dropdown: [
        { name: 'Budget Calculator', href: '/calculator', icon: <Sparkles className="w-4 h-4" /> },
        { name: 'Checklist', href: '/checklist', icon: <ListChecks className="w-4 h-4" /> },
        { name: 'Vendors', href: '/vendors', icon: <Users className="w-4 h-4" /> },
      ]
    },
    { name: 'Testimonials', href: '/testimonials' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white/90 backdrop-blur-sm'
    }`}>
      {/* Announcement Bar */}
      {daysLeft && daysLeft > 0 && daysLeft <= 30 && (
        <div className="bg-gradient-to-r from-gold-500 to-gold-600 text-white py-2 px-4 text-center text-sm">
          <Sparkles className="inline w-4 h-4 mr-2" />
          <span className="font-medium">{daysLeft} days</span> until your wedding! 
          <Link href="/checklist" className="underline ml-2 hover:text-white/80">Check your list</Link>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-white font-serif text-xl">W</span>
            </div>
            <div>
              <h1 className="font-serif text-xl text-gray-800">Lahore Elite</h1>
              <p className="text-xs text-gold-600 -mt-1">Weddings</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <div 
                key={link.name}
                className="relative"
                onMouseEnter={() => link.dropdown && setShowDropdown(link.name)}
                onMouseLeave={() => setShowDropdown(null)}
              >
                <Link 
                  href={link.href}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    router.pathname.startsWith(link.href) 
                      ? 'text-gold-600 bg-gold-50' 
                      : 'text-gray-700 hover:text-gold-600 hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                  {link.dropdown && <ChevronDown className="w-4 h-4" />}
                </Link>
                
                {/* Dropdown */}
                {link.dropdown && showDropdown === link.name && (
                  <div className="absolute top-full left-0 pt-2 w-56 animate-fadeIn">
                    <div className="bg-white rounded-xl shadow-xl border py-2">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-gold-600 hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-gray-400">{item.icon}</span>
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Search Button */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 text-gray-500 hover:text-gold-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Search (Ctrl+K)"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Compare Button */}
            <Link 
              href="/compare"
              className="relative p-2.5 text-gray-500 hover:text-gold-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Compare Venues"
            >
              <GitCompare className="w-5 h-5" />
              {compareList.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                  {compareList.length}
                </span>
              )}
            </Link>

            {/* Favorites Button */}
            <Link 
              href="/favorites"
              className="relative p-2.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Favorites"
            >
              <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Wedding Date Button */}
            {weddingDate && (
              <Link 
                href="/checklist"
                className="flex items-center gap-2 px-3 py-2 bg-gold-50 text-gold-700 rounded-lg text-sm"
                title="Your Wedding Date"
              >
                <Calendar className="w-4 h-4" />
                <span className="font-medium">{daysLeft}d</span>
              </Link>
            )}

            {/* CTA Button */}
            <Link 
              href="/calculator"
              className="px-5 py-2.5 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              Plan Wedding
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t animate-fadeIn">
            <div className="flex flex-col space-y-1">
              <Link href="/" className="px-4 py-3 text-gray-700 hover:text-gold-600 hover:bg-gray-50 rounded-lg font-medium">
                Home
              </Link>
              <Link href="/marquees" className="px-4 py-3 text-gray-700 hover:text-gold-600 hover:bg-gray-50 rounded-lg font-medium">
                All Venues
              </Link>
              <Link href="/calculator" className="px-4 py-3 text-gray-700 hover:text-gold-600 hover:bg-gray-50 rounded-lg font-medium">
                Budget Calculator
              </Link>
              <Link href="/compare" className="px-4 py-3 text-gray-700 hover:text-gold-600 hover:bg-gray-50 rounded-lg font-medium flex items-center justify-between">
                Compare
                {compareList.length > 0 && (
                  <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">{compareList.length}</span>
                )}
              </Link>
              <Link href="/checklist" className="px-4 py-3 text-gray-700 hover:text-gold-600 hover:bg-gray-50 rounded-lg font-medium">
                Checklist
              </Link>
              <Link href="/vendors" className="px-4 py-3 text-gray-700 hover:text-gold-600 hover:bg-gray-50 rounded-lg font-medium">
                Vendors
              </Link>
              <Link href="/gallery" className="px-4 py-3 text-gray-700 hover:text-gold-600 hover:bg-gray-50 rounded-lg font-medium">
                Gallery
              </Link>
              <Link href="/testimonials" className="px-4 py-3 text-gray-700 hover:text-gold-600 hover:bg-gray-50 rounded-lg font-medium">
                Testimonials
              </Link>
              <Link href="/favorites" className="px-4 py-3 text-gray-700 hover:text-gold-600 hover:bg-gray-50 rounded-lg font-medium flex items-center justify-between">
                Favorites
                {favorites.length > 0 && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">{favorites.length}</span>
                )}
              </Link>
              
              {/* Mobile Search */}
              <button 
                onClick={() => { setIsSearchOpen(true); setIsOpen(false); }}
                className="px-4 py-3 text-gray-700 hover:text-gold-600 hover:bg-gray-50 rounded-lg font-medium text-left flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Search
              </button>

              <div className="pt-4">
                <Link 
                  href="/calculator"
                  className="block mx-4 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-lg transition-all text-center"
                >
                  Start Planning
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
