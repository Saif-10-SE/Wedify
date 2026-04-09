import { createContext, useContext, useState, useEffect } from 'react';
import { marquees } from '@/data/marquees';

const WeddingContext = createContext();

export function WeddingProvider({ children }) {
  // Favorites
  const [favorites, setFavorites] = useState([]);
  
  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Wedding Date
  const [weddingDate, setWeddingDate] = useState(null);
  
  // Recently Viewed
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  
  // Comparison List
  const [compareList, setCompareList] = useState([]);
  
  // Inquiry Cart
  const [inquiryCart, setInquiryCart] = useState([]);
  
  // Notification
  const [notification, setNotification] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('wedding_favorites');
      const savedDate = localStorage.getItem('wedding_date');
      const savedRecent = localStorage.getItem('recently_viewed');
      const savedCompare = localStorage.getItem('compare_list');
      const savedInquiry = localStorage.getItem('inquiry_cart');
      
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
      if (savedDate) setWeddingDate(new Date(savedDate));
      if (savedRecent) setRecentlyViewed(JSON.parse(savedRecent));
      if (savedCompare) setCompareList(JSON.parse(savedCompare));
      if (savedInquiry) setInquiryCart(JSON.parse(savedInquiry));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('wedding_favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  useEffect(() => {
    if (typeof window !== 'undefined' && weddingDate) {
      localStorage.setItem('wedding_date', weddingDate.toISOString());
    }
  }, [weddingDate]);

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

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Toggle favorite
  const toggleFavorite = (slug) => {
    setFavorites(prev => {
      const isFavorite = prev.includes(slug);
      if (isFavorite) {
        showNotification('Removed from favorites');
        return prev.filter(s => s !== slug);
      } else {
        showNotification('Added to favorites ❤️');
        return [...prev, slug];
      }
    });
  };

  // Check if favorite
  const isFavorite = (slug) => favorites.includes(slug);

  // Get favorite venues
  const getFavoriteVenues = () => {
    return marquees.filter(m => favorites.includes(m.slug));
  };

  // Add to recently viewed
  const addToRecentlyViewed = (slug) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(s => s !== slug);
      return [slug, ...filtered].slice(0, 5);
    });
  };

  // Get recently viewed venues
  const getRecentlyViewedVenues = () => {
    return recentlyViewed
      .map(slug => marquees.find(m => m.slug === slug))
      .filter(Boolean);
  };

  // Toggle compare
  const toggleCompare = (slug) => {
    setCompareList(prev => {
      const isInList = prev.includes(slug);
      if (isInList) {
        showNotification('Removed from comparison');
        return prev.filter(s => s !== slug);
      } else {
        if (prev.length >= 4) {
          showNotification('Maximum 4 venues can be compared', 'error');
          return prev;
        }
        showNotification('Added to comparison');
        return [...prev, slug];
      }
    });
  };

  // Check if in compare list
  const isInCompareList = (slug) => compareList.includes(slug);

  // Search function
  const performSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    const results = marquees.filter(m => 
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.location.toLowerCase().includes(query.toLowerCase()) ||
      m.area.toLowerCase().includes(query.toLowerCase()) ||
      m.description.toLowerCase().includes(query.toLowerCase()) ||
      m.amenities.some(a => a.toLowerCase().includes(query.toLowerCase()))
    );
    setSearchResults(results);
  };

  // Add to inquiry cart
  const addToInquiry = (slug, details = {}) => {
    setInquiryCart(prev => {
      const exists = prev.find(item => item.slug === slug);
      if (exists) {
        showNotification('Already in inquiry list');
        return prev;
      }
      showNotification('Added to inquiry list 📋');
      return [...prev, { slug, details, addedAt: new Date().toISOString() }];
    });
  };

  // Remove from inquiry cart
  const removeFromInquiry = (slug) => {
    setInquiryCart(prev => prev.filter(item => item.slug !== slug));
    showNotification('Removed from inquiry list');
  };

  // Get days until wedding
  const getDaysUntilWedding = () => {
    if (!weddingDate) return null;
    const today = new Date();
    const wedding = new Date(weddingDate);
    const diffTime = wedding - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const value = {
    // Favorites
    favorites,
    toggleFavorite,
    isFavorite,
    getFavoriteVenues,
    
    // Search
    searchQuery,
    searchResults,
    isSearchOpen,
    setIsSearchOpen,
    performSearch,
    
    // Wedding Date
    weddingDate,
    setWeddingDate,
    getDaysUntilWedding,
    
    // Recently Viewed
    recentlyViewed,
    addToRecentlyViewed,
    getRecentlyViewedVenues,
    
    // Compare
    compareList,
    toggleCompare,
    isInCompareList,
    
    // Inquiry
    inquiryCart,
    addToInquiry,
    removeFromInquiry,
    
    // Notification
    notification,
    showNotification,
  };

  return (
    <WeddingContext.Provider value={value}>
      {children}
    </WeddingContext.Provider>
  );
}

export function useWedding() {
  const context = useContext(WeddingContext);
  if (!context) {
    throw new Error('useWedding must be used within a WeddingProvider');
  }
  return context;
}
