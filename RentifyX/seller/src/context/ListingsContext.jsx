import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ListingsContext = createContext(null);

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop',
];

function getRandomImage() {
  return PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)];
}

export function ListingsProvider({ children }) {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`seller_listings_${user.id}`);
      if (stored) {
        setListings(JSON.parse(stored));
      } else {
        setListings([]);
      }
    } else {
      setListings([]);
    }
  }, [user]);

  const persist = (updated) => {
    setListings(updated);
    if (user) {
      localStorage.setItem(`seller_listings_${user.id}`, JSON.stringify(updated));
    }
  };

  const addListing = (listing) => {
    const newListing = {
      ...listing,
      id: Date.now().toString(),
      image: listing.image || getRandomImage(),
      available: true,
      createdAt: new Date().toISOString(),
    };
    persist([newListing, ...listings]);
    return newListing;
  };

  const updateListing = (id, updates) => {
    const updated = listings.map((l) => (l.id === id ? { ...l, ...updates } : l));
    persist(updated);
  };

  const deleteListing = (id) => {
    persist(listings.filter((l) => l.id !== id));
  };

  const toggleAvailability = (id) => {
    const updated = listings.map((l) =>
      l.id === id ? { ...l, available: !l.available } : l
    );
    persist(updated);
  };

  return (
    <ListingsContext.Provider
      value={{ listings, addListing, updateListing, deleteListing, toggleAvailability }}
    >
      {children}
    </ListingsContext.Provider>
  );
}

export function useListings() {
  const ctx = useContext(ListingsContext);
  if (!ctx) throw new Error('useListings must be used within ListingsProvider');
  return ctx;
}
