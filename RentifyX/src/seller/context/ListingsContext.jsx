import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ListingsContext = createContext(null);
const API_URL = 'https://rentifyx-ff33.onrender.com/api/listings';

export function ListingsProvider({ children }) {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch listings from MongoDB whenever user changes
  useEffect(() => {
    if (user) {
      fetchListings();
    } else {
      setListings([]);
    }
  }, [user]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const res = await fetch(`${API_URL}/my`, {
        headers: {
          Authorization: currentUser?.id || '',
        },
      });
      const data = await res.json();
      if (res.ok) {
        const mapped = data.listings.map((l) => ({
          ...l,
          id: l._id || l.id,
          image: l.images && l.images.length > 0 ? l.images[0].url : '',
          available: l.available !== undefined ? l.available : true,
        }));
        setListings(mapped);
      }
    } catch (err) {
      console.error('Failed to fetch listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const addListing = (listing) => {
    const newListing = {
      ...listing,
      id: listing.id || listing._id || Date.now().toString(),
      image: listing.image || (listing.images && listing.images.length > 0 ? listing.images[0].url : ''),
      available: listing.available !== undefined ? listing.available : true,
      createdAt: listing.createdAt || new Date().toISOString(),
    };
    setListings((prev) => [newListing, ...prev]);
    return newListing;
  };

  const updateListing = (id, updates) => {
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const deleteListing = (id) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  const toggleAvailability = (id) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, available: !l.available } : l))
    );
  };

  return (
    <ListingsContext.Provider
      value={{ listings, loading, addListing, updateListing, deleteListing, toggleAvailability }}
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
