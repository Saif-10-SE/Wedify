import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useWedding } from '@/context/WeddingContext';
import { Search, Heart, Calendar, Menu, X, ChevronDown, Sparkles, GitCompare, ListChecks, Camera, Users, Mail } from 'lucide-react';

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

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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
      ]
    },
    { name: 'Data Insights', href: '/insights' },
    { name: 'AI Chatbot', href: '/chatbot' },
    { name: 'Image Generation', href: '/image-generation' },
    { name: 'Testimonials', href: '/testimonials' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b border-white/35 transition-all duration-300 ${
      isScrolled
        ? 'bg-white/55 backdrop-blur-xl shadow-[0_10px_30px_rgba(31,24,18,0.18)]'
        : 'bg-white/35 backdrop-blur-xl shadow-[0_8px_24px_rgba(31,24,18,0.1)]'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex justify-between items-center h-16 sm:h-20 gap-2">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group min-w-0 shrink">
            <Image
              src="/images/wedify-logo.svg"
              alt="Wedify"
              width={208}
              height={72}
              priority
              className="h-9 sm:h-12 w-auto transition-transform group-hover:scale-[1.01]"
            />
            <div className="hidden 2xl:block min-w-0">
              <p className="text-xs text-gray-700/90 -mt-1 truncate max-w-[11rem]">Pakistan&apos;s first wedding planning platform</p>
            </div>
          </Link>

          <div className="hidden xl:flex items-center space-x-0.5">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() => link.dropdown && setShowDropdown(link.name)}
                onMouseLeave={() => setShowDropdown(null)}
              >
                <Link
                  href={link.href}
                  className={`flex items-center gap-1 px-2.5 py-2 rounded-lg font-medium text-sm transition-all ${
                    router.pathname.startsWith(link.href)
                      ? 'text-gold-700 bg-white/70 shadow-sm'
                      : 'text-gray-800 hover:text-gold-700 hover:bg-white/55'
                  }`}
                >
                  {link.name}
                  {link.dropdown && <ChevronDown className="w-4 h-4" />}
                </Link>

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

          <div className="flex items-center gap-0.5 sm:gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="rounded-lg p-2 text-gray-700/85 transition-colors hover:bg-white/65 hover:text-gold-700"
              title="Search"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              href="/favorites"
              className="relative rounded-lg p-2 text-gray-700/85 transition-colors hover:bg-white/65 hover:text-red-500"
              title="Favorites"
              aria-label="Favorites"
            >
              <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            <div className="hidden md:flex items-center gap-2">
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

              {weddingDate && daysLeft != null && daysLeft > 0 && (
                <Link
                  href="/checklist"
                  className="flex items-center gap-2 rounded-lg border border-white/40 bg-white/60 px-3 py-2 text-sm text-gold-800 backdrop-blur-sm"
                  title="Days until your wedding"
                >
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">{daysLeft}d</span>
                </Link>
              )}

              <Link
                href="/calculator"
                className="rounded-lg bg-gold-500 px-5 py-2.5 font-semibold text-white shadow-md transition-all hover:bg-gold-600 hover:shadow-lg"
              >
                Plan Wedding
              </Link>
            </div>

            <button
              className="rounded-lg p-2 transition-colors hover:bg-white/65 xl:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X className="w-6 h-6 text-gray-800" />
              ) : (
                <Menu className="w-6 h-6 text-gray-800" />
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="xl:hidden border-t border-white/35 animate-fadeIn max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)]">
            <div className="flex flex-col space-y-1 py-3">
              <Link href="/" className="px-4 py-3 text-gray-800 hover:text-gold-700 hover:bg-white/60 rounded-lg font-medium">
                Home
              </Link>
              <Link href="/marquees" className="px-4 py-3 text-gray-800 hover:text-gold-700 hover:bg-white/60 rounded-lg font-medium">
                All Venues
              </Link>
              <Link href="/calculator" className="px-4 py-3 text-gray-800 hover:text-gold-700 hover:bg-white/60 rounded-lg font-medium">
                Budget Calculator
              </Link>
              <Link href="/insights" className="px-4 py-3 text-gray-800 hover:text-gold-700 hover:bg-white/60 rounded-lg font-medium">
                Data Insights
              </Link>
              <Link href="/chatbot" className="px-4 py-3 text-gray-800 hover:text-gold-700 hover:bg-white/60 rounded-lg font-medium">
                AI Chatbot
              </Link>
              <Link href="/image-generation" className="px-4 py-3 text-gray-800 hover:text-gold-700 hover:bg-white/60 rounded-lg font-medium">
                Image Generation
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
              <Link href="/vendors" className="px-4 py-3 text-gray-800 hover:text-gold-700 hover:bg-white/60 rounded-lg font-medium">
                Vendors
              </Link>
              <Link href="/gallery" className="px-4 py-3 text-gray-800 hover:text-gold-700 hover:bg-white/60 rounded-lg font-medium">
                Gallery
              </Link>
              <Link href="/testimonials" className="px-4 py-3 text-gray-800 hover:text-gold-700 hover:bg-white/60 rounded-lg font-medium">
                Testimonials
              </Link>

              <div className="pt-3 px-4 pb-4 space-y-2">
                <Link
                  href="/calculator"
                  className="block w-full px-6 py-3.5 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-xl transition-all text-center"
                >
                  Start Planning
                </Link>
                <Link
                  href="/chatbot"
                  className="block w-full px-6 py-3.5 border border-gold-300 bg-white/80 text-gold-800 font-semibold rounded-xl transition-all text-center"
                >
                  Talk to AI Chatbot
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
