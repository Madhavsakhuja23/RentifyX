import { useState, useMemo, useRef, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { getVehicleListings } from '../api';

// Component Imports
import Header from '../components/Header/Header';
import HeroSection from './HeroSection';
import DriveableCard from './DriveableCard';
import DriveableDetail from './DriveableDetail';
import Pagination from './Pagination';
import Footer from '../components/Footer/Footer';
import VehicleComparison from '../components/VehicleComparison/VehicleComparison';
import DriveablesFilterBar from './DriveablesFilterBar';

// CSS
import './Driveables.css';

/* ─────────────────────────────────────────────────────────────────────────────
   Subcategory → UI category key mapping
   Listing model subcategory values: "Cars" | "EV" | "Bike" | "Bicycle"
───────────────────────────────────────────────────────────────────────────── */
const SUBCATEGORY_MAP = {
  cars:     ['Cars', 'cars', 'car'],
  evs:      ['EV', 'ev', 'evs', 'electric'],
  bikes:    ['Bike', 'bike', 'bikes', 'motorcycle', 'scooter'],
  bicycles: ['Bicycle', 'bicycle', 'bicycles', 'cycle'],
};

const getCategory = (subcategory = '') => {
  const s = subcategory.trim();
  for (const [key, variants] of Object.entries(SUBCATEGORY_MAP)) {
    if (variants.some(v => v.toLowerCase() === s.toLowerCase())) return key;
  }
  return 'cars'; // default
};

/* ─────────────────────────────────────────────────────────────────────────────
   Normalise a raw Listing document into the shape components expect
───────────────────────────────────────────────────────────────────────────── */
const normalizeListing = (listing) => {
  // ── Images (Cloudinary objects {url, publicId}) ──────────────────────────
  const images = Array.isArray(listing.images)
    ? listing.images
        .map(img => (typeof img === 'object' && img?.url ? img.url : img))
        .filter(Boolean)
    : [];
  const primaryImage = images[0] || '';

  // ── Category (derived from subcategory) ──────────────────────────────────
  const category = getCategory(listing.subcategory);

  // ── Price parsing ─────────────────────────────────────────────────────────
  // price is stored as a string e.g. "500/hr", "2000/day", or just "500"
  const priceStr   = String(listing.price || '0');
  const priceNum   = parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;
  // Detect pricing type: only mark as daily if the seller explicitly listed it per day
  const isDaily    = /day/i.test(priceStr) && !/hr|hour/i.test(priceStr);
  // dayRate is ONLY set for daily listings — hourly listings get 0 (falsy)
  // so PricingSection won't show the "Daily Basis" tab and the header shows "/ hr"
  const hourlyRate = isDaily ? 0        : priceNum;
  const dayRate    = isDaily ? priceNum : 0;

  // ── Default specifications per category ──────────────────────────────────
  const defaultSpecs = {
    cars:     { fuelType: 'Petrol',   transmission: 'Automatic', seatingCapacity: 5 },
    evs:      { fuelType: 'Electric', transmission: 'Automatic', seatingCapacity: 5 },
    bikes:    { fuelType: 'Petrol',   transmission: 'Manual',    seatingCapacity: 2 },
    bicycles: { type: 'City',         gears: 'Single-speed',     seatingCapacity: 1 },
  };

  return {
    // identity
    id:          listing._id || listing.id,
    _id:         listing._id || listing.id,
    // display
    name:        listing.title  || listing.name || 'Untitled Vehicle',
    title:       listing.title  || listing.name || 'Untitled Vehicle',
    description: listing.description || '',
    tagline:     listing.tagline     || '',
    location:    listing.location    || '',
    sellerName:  listing.sellerName  || '',
    rating:      Number(listing.rating || 4.5),
    // images
    image:  primaryImage,
    images,
    // category / pricing
    category,
    subcategory: listing.subcategory || '',
    price:       priceStr,
    hourlyRate,
    dayRate,
    // specs — use stored specs if present, else sensible defaults
    specifications: listing.specifications
      ? listing.specifications
      : defaultSpecs[category] || defaultSpecs.cars,
    available: listing.available ?? true,
  };
};

/* ─────────────────────────────────────────────────────────────────────────────
   Extract listings array from various API response shapes
───────────────────────────────────────────────────────────────────────────── */
const fromResponse = (response) => {
  if (Array.isArray(response))               return response;
  if (Array.isArray(response?.listings))     return response.listings;
  if (Array.isArray(response?.data))         return response.data;
  if (Array.isArray(response?.items))        return response.items;
  return [];
};

/* ─────────────────────────────────────────────────────────────────────────────
   Category tab definitions
───────────────────────────────────────────────────────────────────────────── */
const CATEGORIES = [
  { key: 'cars',     label: 'Cars',      heading: 'Premium cars for every journey',    description: 'From compact city cars to luxury SUVs. Find the perfect car rental for your needs.' },
  { key: 'bikes',    label: 'Bikes',     heading: 'Two-wheelers ready to ride',         description: 'Explore the city on two wheels. Browse our collection of bikes and scooters.' },
  { key: 'evs',      label: 'EVs',       heading: 'Go green with electric vehicles',    description: 'Eco-friendly electric vehicles for a sustainable ride. Zero emissions, full adventure.' },
  { key: 'bicycles', label: 'Bicycles',  heading: 'Pedal-powered adventures',           description: 'Mountain bikes, city cruisers, and more. Rent a bicycle for your next outdoor adventure.' },
];

const ITEMS_PER_PAGE = 6;

/* ─────────────────────────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────────────────────────── */
const DriveablesMain = () => {
  const [activeCategory,        setActiveCategory]        = useState('all');
  const [vehicles,              setVehicles]              = useState([]);
  const [loading,               setLoading]               = useState(true);
  const [error,                 setError]                 = useState('');
  const [isFiltering,           setIsFiltering]           = useState(false);
  const [currentPage,           setCurrentPage]           = useState(1);
  const [selectedDriveable,     setSelectedDriveable]     = useState(null);
  const [sortOrder,             setSortOrder]             = useState('default');
  const [compareList,           setCompareList]           = useState([]);
  const [showMaxComparePopup,   setShowMaxComparePopup]   = useState(false);
  const [searchFilters,         setSearchFilters]         = useState({
    location: '', guests: 1, checkIn: undefined, checkOut: undefined,
  });

  const fleetRef       = useRef(null);
  const compareCategory = compareList[0]?.category;

  /* ── Fetch from MongoDB ──────────────────────────────────────────────── */
  useEffect(() => {
    let ignore = false;

    const fetchVehicles = async () => {
      setError('');
      setIsFiltering(true);

      try {
        const response = await getVehicleListings();
        if (ignore) return;

        const raw        = fromResponse(response);
        const normalized = raw.map(normalizeListing);
        setVehicles(normalized);
      } catch (err) {
        if (ignore) return;
        console.error('Failed to fetch vehicle listings:', err);
        setError('Could not load vehicles. Please check your connection or try again.');
        setVehicles([]);
      } finally {
        if (ignore) return;
        setLoading(false);
        setIsFiltering(false);
      }
    };

    fetchVehicles();
    return () => { ignore = true; };
  }, []); // Fetch once on mount — all filtering is client-side

  /* ── Client-side filter + sort ───────────────────────────────────────── */
  const filtered = useMemo(() => {
    let result = [...vehicles];

    // Category tab filter
    if (activeCategory !== 'all') {
      result = result.filter(v => v.category === activeCategory);
    }

    // Location / keyword filter
    if (searchFilters.location?.trim()) {
      const q = searchFilters.location.toLowerCase().trim();

      // Terrain-based suitability scoring
      const getSuitabilityScore = (item) => {
        const subcat = (item.subcategory || '').toLowerCase();
        const hills   = ['manali', 'leh', 'shimla', 'kasol', 'hill', 'coorg', 'munnar'];
        const city    = ['mumbai', 'bangalore', 'delhi', 'pune', 'traffic'];
        const coastal = ['goa', 'pondy', 'varkala', 'beach', 'coast'];

        if (hills.some(k => q.includes(k))) {
          if (subcat === 'cars' || item.category === 'cars') return 10;
          if (item.name?.toLowerCase().includes('enfield'))  return 8;
        }
        if (city.some(k => q.includes(k))) {
          if (item.category === 'evs')   return 10;
          if (item.category === 'bikes') return 7;
        }
        if (coastal.some(k => q.includes(k))) {
          if (item.category === 'bikes') return 10;
        }
        return 0;
      };

      result = result.filter(item => {
        const loc     = (item.location    || '').toLowerCase();
        const name    = (item.name        || '').toLowerCase();
        const tagline = (item.tagline     || '').toLowerCase();
        const subcat  = (item.subcategory || '').toLowerCase();
        const desc    = (item.description || '').toLowerCase();
        return loc.includes(q) || name.includes(q) || tagline.includes(q)
            || subcat.includes(q) || desc.includes(q);
      });

      result.sort((a, b) => {
        const scoreA = getSuitabilityScore(a);
        const scoreB = getSuitabilityScore(b);
        if (scoreA !== scoreB) return scoreB - scoreA;

        const locA = (a.location || '').toLowerCase();
        const locB = (b.location || '').toLowerCase();
        if (locA === q && locB !== q) return -1;
        if (locB === q && locA !== q) return  1;
        if (locA.startsWith(q) && !locB.startsWith(q)) return -1;
        if (locB.startsWith(q) && !locA.startsWith(q)) return  1;
        return 0;
      });
    }

    // Guests / seating capacity
    if (searchFilters.guests && searchFilters.guests > 1) {
      result = result.filter(item =>
        (item.specifications?.seatingCapacity || 1) >= searchFilters.guests
      );
    }

    // Sort
    if (sortOrder === 'low')  result.sort((a, b) => (a.hourlyRate || 0) - (b.hourlyRate || 0));
    if (sortOrder === 'high') result.sort((a, b) => (b.hourlyRate || 0) - (a.hourlyRate || 0));

    return result;
  }, [activeCategory, sortOrder, vehicles, searchFilters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated  = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /* ── Handlers ────────────────────────────────────────────────────────── */
  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fleetRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleToggleCompare = (vehicle) => {
    setCompareList(prev => {
      const exists = prev.find(v => v.id === vehicle.id);
      if (exists) return prev.filter(v => v.id !== vehicle.id);

      if (prev.length > 0 && prev[0].category !== vehicle.category) {
        alert(`Please compare only ${prev[0].category} vehicles together.`);
        return prev;
      }
      if (prev.length >= 3) { setShowMaxComparePopup(true); return prev; }
      return [...prev, vehicle];
    });
  };

  const handleSearch = (filters) => {
    setSearchFilters(filters);
    setCurrentPage(1);
    fleetRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const currentCategory = CATEGORIES.find(c => c.key === activeCategory);

  /* ── Detail overlay ─────────────────────────────────────────────────── */
  if (selectedDriveable) {
    return (
      <div className="bg-light min-vh-100">
        <Header />
        <DriveableDetail
          driveable={selectedDriveable}
          onClose={() => setSelectedDriveable(null)}
        />
      </div>
    );
  }

  /* ── Main render ─────────────────────────────────────────────────────── */
  return (
    <div className="drv-page-container">
      <Header />

      <HeroSection />

      <DriveablesFilterBar
        filters={searchFilters}
        onChange={(newFilters) => {
          setSearchFilters(newFilters);
          setCurrentPage(1);
        }}
      />

      {/* Category tabs + content layout — mirrors Dwellings design */}
      <div className="drv-section-container drv-tabs-content-wrapper">

        {/* Left — Category tabs */}
        <aside className="drv-category-tabs-sidebar">
          <div className="drv-category-tabs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => handleCategoryChange(activeCategory === cat.key ? 'all' : cat.key)}
                className={`drv-category-tab-button ${activeCategory === cat.key ? 'active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Right — Content */}
        <div className="drv-category-content">

          {/* Category heading */}
          {activeCategory !== 'all' && currentCategory && (
            <div className="drv-category-header">
              <h2 className="drv-category-title">{currentCategory.heading}</h2>
              <p className="drv-category-description">{currentCategory.description}</p>
            </div>
          )}

          {/* License notice */}
          <div className="drv-notice-banner">
            <Shield className="drv-notice-icon" />
            <p className="drv-notice-text">
              <span>Driving License verification</span> is mandatory for all vehicle rentals.
              Please keep your valid ID details handy.
            </p>
          </div>

          {/* Results count / status */}
          <div className="drv-count-container">
            <p className="drv-results-count">
              {loading
                ? 'Loading vehicles…'
                : <>Showing <span>{filtered.length}</span> {activeCategory !== 'all' ? activeCategory : 'vehicles'}</>
              }
            </p>
            {error && <p className="drv-results-count" style={{ color: '#e53e3e', marginTop: 4 }}>{error}</p>}
            {isFiltering && !loading && <p className="drv-results-count" style={{ marginTop: 4 }}>Refreshing…</p>}
            {compareCategory && (
              <p className="drv-results-count" style={{ marginTop: 4 }}>
                Comparing only <span>{compareCategory}</span> vehicles
              </p>
            )}
          </div>

          {/* Vehicle Comparison bar */}
          {compareList.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <VehicleComparison
                vehicles={compareList}
                onRemove={(id) => setCompareList(prev => prev.filter(v => v.id !== id))}
              />
            </div>
          )}

          {/* Grid */}
          <main className="drv-main-content" ref={fleetRef}>
            {loading ? (
              <div className="drv-empty-state">
                <div style={{ fontSize: 40, marginBottom: 12 }}>🚗</div>
                <p>Loading vehicles from database…</p>
              </div>
            ) : paginated.length > 0 ? (
              <div className="drv-listings-grid">
                {paginated.map((driveable, index) => (
                  <DriveableCard
                    key={driveable.id}
                    driveable={driveable}
                    index={index}
                    onViewDetails={() => setSelectedDriveable(driveable)}
                    onToggleCompare={handleToggleCompare}
                    isSelectedForComparison={compareList.some(v => v.id === driveable.id)}
                    isCompareDisabled={
                      Boolean(compareCategory) &&
                      compareCategory !== driveable.category &&
                      !compareList.some(v => v.id === driveable.id)
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="drv-empty-state">
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                <p>
                  {error
                    ? 'Failed to load vehicles. Please refresh the page.'
                    : 'No vehicles found matching your criteria.'}
                </p>
              </div>
            )}
          </main>

          {!loading && !error && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={filtered.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          )}
        </div>
      </div>

      <Footer />

      {/* Max-compare popup */}
      {showMaxComparePopup && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="max-compare-title"
          className="d-flex align-items-center justify-content-center"
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,.45)', zIndex: 1200, padding: '1rem' }}
          onClick={() => setShowMaxComparePopup(false)}
        >
          <div
            className="bg-white rounded-4 shadow-lg p-4"
            style={{ width: '100%', maxWidth: '420px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 id="max-compare-title" className="fw-bold mb-2">Comparison limit reached</h5>
            <p className="text-muted mb-4">You can compare up to 3 vehicles at a time.</p>
            <button className="btn btn-primary w-100" onClick={() => setShowMaxComparePopup(false)}>
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriveablesMain;