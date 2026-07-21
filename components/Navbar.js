import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useWedding } from '@/context/WeddingContext';
import { Search, Heart, Calendar, Menu, X, ChevronDown, Sparkles, GitCompare, ListChecks, Camera, Users, Bot, Star, Mail } from 'lucide-react';

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
        { name: 'Invitations', href: '/invitations', icon: <Mail className="w-4 h-4" /> },
        { name: 'Checklist', href: '/checklist', icon: <ListChecks className="w-4 h-4" /> },
        { name: 'Vendors', href: '/vendors', icon: <Users className="w-4 h-4" /> },
        { name: 'AI Planner', href: '/chatbot', icon: <Bot className="w-4 h-4" /> },
      ]
    },
    { name: 'Testimonials', href: '/testimonials' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b border-white/35 transition-all duration-300 ${
      isScrolled
        ? 'bg-white/55 backdrop-blur-xl shadow-[0_10px_30px_rgba(31,24,18,0.18)]'
        : 'bg-white/35 backdrop-blur-xl shadow-[0_8px_24px_rgba(31,24,18,0.1)]'
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
          {/* Logo (updated to Wedify) */}
          <Link href="/" className="flex items-center space-x-3 group">
            <Image
              src="/images/wedify-logo.svg"
              alt="Wedify"
              width={208}
              height={72}
              priority
              className="h-12 w-auto transition-transform group-hover:scale-[1.01]"
            />
            <div>
              <p className="text-xs text-gray-700/90 -mt-1">Pakistan's first wedding planning platform</p>
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
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all ${
                    router.pathname.startsWith(link.href) 
                      ? 'text-gold-700 bg-white/70 shadow-sm' 
                      : 'text-gray-800 hover:text-gold-700 hover:bg-white/55'
                  }`}
                >
                  {link.name}
                  {link.dropdown && <ChevronDown className="w-4 h-4" />}
                </Link>
                
                {/* Dropdown */}
                {link.dropdown && showDropdown === link.name && (
                  <div className="absolute top-full left-0 pt-2 w-56 animate-fadeIn">
                    <div className="rounded-xl border border-white/40 bg-white/75 py-2 shadow-xl backdrop-blur-lg">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center gap-3 px-4 py-3 text-gray-800 hover:text-gold-700 hover:bg-white/70 transition-colors"
                        >
                          <span className="text-gray-500">{item.icon}</span>
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
              className="rounded-lg p-2.5 text-gray-700/85 transition-colors hover:bg-white/65 hover:text-gold-700"
              title="Search (Ctrl+K)"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Compare Button */}
            <Link 
              href="/compare"
              className="relative rounded-lg p-2.5 text-gray-700/85 transition-colors hover:bg-white/65 hover:text-gold-700"
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
              className="relative rounded-lg p-2.5 text-gray-700/85 transition-colors hover:bg-white/65 hover:text-red-500"
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
                className="flex items-center gap-2 rounded-lg border border-white/40 bg-white/60 px-3 py-2 text-sm text-gold-800 backdrop-blur-sm"
                title="Your Wedding Date"
              >
                <Calendar className="w-4 h-4" />
                <span className="font-medium">{daysLeft}d</span>
              </Link>
            )}

            {/* CTA Button */}
            <Link
              href="/chatbot"
              className="rounded-lg border border-gold-300 bg-white/70 px-4 py-2.5 font-semibold text-gold-800 transition-all hover:bg-white hover:text-gold-900"
            >
              AI Planner
            </Link>

            <Link 
              href="/calculator"
              className="rounded-lg bg-gold-500 px-5 py-2.5 font-semibold text-white shadow-md transition-all hover:bg-gold-600 hover:shadow-lg"
            >
              Plan Wedding
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="rounded-lg p-2 transition-colors hover:bg-white/65 lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-800" />
            ) : (
              <Menu className="w-6 h-6 text-gray-800" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-white/35 animate-fadeIn">
            <div className="flex flex-col space-y-1">
              <Link href="/" className="px-4 py-3 text-gray-800 hover:text-gold-700 hover:bg-white/60 rounded-lg font-medium">
                Home
              </Link>
              <Link href="/marquees" className="px-4 py-3 text-gray-800 hover:text-gold-700 hover:bg-white/60 rounded-lg font-medium">
                All Venues
              </Link>
              <Link href="/calculator" className="px-4 py-3 text-gray-800 hover:text-gold-700 hover:bg-white/60 rounded-lg font-medium">
                Budget Calculator
              </Link>
              <Link href="/invitations" className="px-4 py-3 text-gray-800 hover:text-gold-700 hover:bg-white/60 rounded-lg font-medium">
                Invitations
              </Link>
              <Link href="/compare" className="px-4 py-3 text-gray-800 hover:text-gold-700 hover:bg-white/60 rounded-lg font-medium flex items-center justify-between">
                Compare
                {compareList.length > 0 && (
                  <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">{compareList.length}</span>
                )}
              </Link>
              <Link href="/checklist" className="px-4 py-3 text-gray-800 hover:text-gold-700 hover:bg-white/60 rounded-lg font-medium">
                Checklist
              </Link>
              <Link href="/chatbot" className="px-4 py-3 text-gray-800 hover:text-gold-700 hover:bg-white/60 rounded-lg font-medium">
                AI Planner
              </Link>
              <Link href="/vendors" className="px-4 py-3 text-gray-800 hover:text-gold-700 hover:bg-white/60 rounded-lg font-medium">
                Vendors
              </Link>
              <Link href="/gallery" className="px-4 py-3 text-gray-800 hover:text-gold-700 hover:bg-white/60 rounded-lg font-medium">
                Gallery
              </Link>
              <Link href="/testimonials" className="px-4 py-3 text-gray-800 hover:text-gold-700 hover:bg-white/60 rounded-lg font-medium">
                Testimonials
              </Link>
              <Link href="/favorites" className="px-4 py-3 text-gray-800 hover:text-gold-700 hover:bg-white/60 rounded-lg font-medium flex items-center justify-between">
                Favorites
                {favorites.length > 0 && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">{favorites.length}</span>
                )}
              </Link>
              
              {/* Mobile Search */}
              <button 
                onClick={() => { setIsSearchOpen(true); setIsOpen(false); }}
                className="px-4 py-3 text-left flex items-center gap-2 rounded-lg font-medium text-gray-800 hover:text-gold-700 hover:bg-white/60"
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
