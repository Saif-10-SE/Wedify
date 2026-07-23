import { createContext, useContext, useState, useEffect } from 'react';
import { marquees } from '@/data/marquees';

const WeddingContext = createContext();

export function WeddingProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [weddingDate, setWeddingDateState] = useState(null);
  const [brideName, setBrideNameState] = useState('');
  const [groomName, setGroomNameState] = useState('');
  const [isWeddingHydrated, setIsWeddingHydrated] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [inquiryCart, setInquiryCart] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      // Big-day timer is visit-only: wipe any previously saved date/names
      localStorage.removeItem('wedding_date');
      localStorage.removeItem('wedding_couple_name');
      localStorage.removeItem('wedding_bride_name');
      localStorage.removeItem('wedding_groom_name');
      sessionStorage.removeItem('wedify-bigday-dismissed');

      const savedFavorites = localStorage.getItem('wedding_favorites');
      const savedRecent = localStorage.getItem('recently_viewed');
      const savedCompare = localStorage.getItem('compare_list');
      const savedInquiry = localStorage.getItem('inquiry_cart');

      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
      if (savedRecent) setRecentlyViewed(JSON.parse(savedRecent));
      if (savedCompare) setCompareList(JSON.parse(savedCompare));
      if (savedInquiry) setInquiryCart(JSON.parse(savedInquiry));
    } catch (_) {
      // ignore corrupt storage
    } finally {
      setIsWeddingHydrated(true);
    }
  }, []);

  // Leaving the site / closing the tab clears the countdown so the next visit asks again
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const resetOnExit = () => {
      setWeddingDateState(null);
      setBrideNameState('');
      setGroomNameState('');
    };
    window.addEventListener('pagehide', resetOnExit);
    return () => window.removeEventListener('pagehide', resetOnExit);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('wedding_favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('recently_viewed', JSON.stringify(recentlyViewed));
    }
  }, [recentlyViewed]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('compare_list', JSON.stringify(compareList));
    }
  }, [compareList]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('inquiry_cart', JSON.stringify(inquiryCart));
    }
  }, [inquiryCart]);

  const setWeddingDate = (date) => {
    setWeddingDateState(date ? new Date(date) : null);
  };

  const setBrideName = (name) => {
    setBrideNameState(String(name || '').trim());
  };

  const setGroomName = (name) => {
    setGroomNameState(String(name || '').trim());
  };

  const clearBigDay = () => {
    setWeddingDateState(null);
    setBrideNameState('');
    setGroomNameState('');
  };

  const coupleLabel = [brideName, groomName].filter(Boolean).join(' & ');

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleFavorite = (slug) => {
    setFavorites((prev) => {
      const isFavorite = prev.includes(slug);
      if (isFavorite) {
        showNotification('Removed from favorites');
        return prev.filter((s) => s !== slug);
      }
      showNotification('Added to favorites');
      return [...prev, slug];
    });
  };

  const isFavorite = (slug) => favorites.includes(slug);

  const getFavoriteVenues = () => {
    return marquees.filter((m) => favorites.includes(m.slug));
  };

  const addToRecentlyViewed = (slug) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((s) => s !== slug);
      return [slug, ...filtered].slice(0, 5);
    });
  };

  const getRecentlyViewedVenues = () => {
    return recentlyViewed.map((slug) => marquees.find((m) => m.slug === slug)).filter(Boolean);
  };

  const toggleCompare = (slug) => {
    setCompareList((prev) => {
      const isInList = prev.includes(slug);
      if (isInList) {
        showNotification('Removed from comparison');
        return prev.filter((s) => s !== slug);
      }
      if (prev.length >= 4) {
        showNotification('Maximum 4 venues can be compared', 'error');
        return prev;
      }
      showNotification('Added to comparison');
      return [...prev, slug];
    });
  };

  const isInCompareList = (slug) => compareList.includes(slug);

  const performSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    const results = marquees.filter(
      (m) =>
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.location.toLowerCase().includes(query.toLowerCase()) ||
        m.area.toLowerCase().includes(query.toLowerCase()) ||
        m.description.toLowerCase().includes(query.toLowerCase()) ||
        m.amenities.some((a) => a.toLowerCase().includes(query.toLowerCase()))
    );
    setSearchResults(results);
  };

  const addToInquiry = (slug, details = {}) => {
    setInquiryCart((prev) => {
      const exists = prev.find((item) => item.slug === slug);
      if (exists) {
        showNotification('Already in inquiry list');
        return prev;
      }
      showNotification('Added to inquiry list');
      return [...prev, { slug, details, addedAt: new Date().toISOString() }];
    });
  };

  const removeFromInquiry = (slug) => {
    setInquiryCart((prev) => prev.filter((item) => item.slug !== slug));
    showNotification('Removed from inquiry list');
  };

  const getDaysUntilWedding = () => {
    if (!weddingDate) return null;
    const today = new Date();
    const wedding = new Date(weddingDate);
    const diffTime = wedding - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const value = {
    favorites,
    toggleFavorite,
    isFavorite,
    getFavoriteVenues,
    searchQuery,
    searchResults,
    isSearchOpen,
    setIsSearchOpen,
    performSearch,
    weddingDate,
    setWeddingDate,
    brideName,
    setBrideName,
    groomName,
    setGroomName,
    coupleLabel,
    clearBigDay,
    isWeddingHydrated,
    getDaysUntilWedding,
    recentlyViewed,
    addToRecentlyViewed,
    getRecentlyViewedVenues,
    compareList,
    toggleCompare,
    isInCompareList,
    inquiryCart,
    addToInquiry,
    removeFromInquiry,
    notification,
    showNotification
  };

  return <WeddingContext.Provider value={value}>{children}</WeddingContext.Provider>;
}

export function useWedding() {
  const context = useContext(WeddingContext);
  if (!context) {
    throw new Error('useWedding must be used within a WeddingProvider');
  }
  return context;
}
