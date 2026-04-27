import { useState, useMemo, useRef, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { getVehicles } from '../api';

// Component Imports
import Header from '../components/Header/Header';
import HeroSection from './HeroSection';
import DriveableCard from './DriveableCard';
import DriveableDetail from './DriveableDetail';
import Pagination from './Pagination';
import Footer from '../components/Footer/Footer';
import VehicleComparison from '../components/VehicleComparison/VehicleComparison';
import DriveablesFilterBar from './DriveablesFilterBar';

// CSS Import
import './Driveables.css';

// Image Imports (assuming paths are correct based on your original file)
import hondaCityImg from '../assets/honda-city.webp';
import royalEnfieldImg from '../assets/royal-enfield.avif';
import teslaImg from '../assets/tesla3.avif';
import mountainBikeImg from '../assets/mountain-bike.jpg';
import activa6gImg from '../assets/activa-6g.avif';
import olaS1ProImg from '../assets/olaS1-pro.avif';
import marutiSwiftImg from '../assets/maruti-swift.avif';
import cityBicycleImg from '../assets/city-bicycle.webp';
import toyotaFortunerImg from '../assets/toyota-fortuner.webp';
import cretaImg from '../assets/creta.avif';
import bajajPulsarImg from '../assets/bajaj-pulsar.avif';
import MGZsEVImg from '../assets/MG-ZS-EV.jpg';
import hybridBikkeImg from '../assets/hybrid-bikke.webp';
import jupiterImg from '../assets/jupiter.avif';
import ather450Img from '../assets/ather450.avif';
import bmxBikeImg from '../assets/bmxbike.jpg';
import tataNexomImg from '../assets/tatanexom.jpg';
import ktmDukeImg from '../assets/ktmduke.avif';
import KiaSeltosImg from '../assets/KiaSeltos.avif';
import gravelBikeImg from '../assets/gravelbike.jpg';

const imageMap = { hondaCityImg, royalEnfieldImg, teslaImg, mountainBikeImg, activa6gImg, olaS1ProImg, marutiSwiftImg, cityBicycleImg, cretaImg, bajajPulsarImg, MGZsEVImg, hybridBikkeImg, toyotaFortunerImg, jupiterImg, ather450Img, bmxBikeImg, tataNexomImg, ktmDukeImg, KiaSeltosImg, gravelBikeImg };

const ITEMS_PER_PAGE = 6;

const DriveablesMain = () => {
  // State matched to Dwellings index.tsx logic
  const [activeCategory, setActiveCategory] = useState('all');
  const [dbVehicles, setDbVehicles] = useState([]); // Initialized to empty array as we use getVehicles
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDriveable, setSelectedDriveable] = useState(null);
  const [sortOrder, setSortOrder] = useState('default');
  const [compareList, setCompareList] = useState([]);
  const [showMaxComparePopup, setShowMaxComparePopup] = useState(false);
  const [searchFilters, setSearchFilters] = useState({ location: '', guests: 1, checkIn: undefined, checkOut: undefined });
  const fleetRef = useRef(null);
  const compareCategory = compareList[0]?.category;

  // DYNAMIC FETCH FROM MONGODB
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await getVehicles({ category: activeCategory === 'all' ? undefined : activeCategory });
        
        if (Array.isArray(data)) {
          const mappedData = data.map(v => {
              // Priority 1: Cloudinary array from MongoDB (as shown in your screenshot)
              // Priority 2: Mapped local image from imageMap
              // Priority 3: Fallback image
              const dbImage = (v.images && v.images.length > 0) ? v.images[0].url : null;
              const allDbImages = (v.images && v.images.length > 0) ? v.images.map(img => img.url) : null;

              return {
                  ...v,
                  id: v._id || v.id, 
                  name: v.name || v.title, // Map 'title' from DB to 'name' used in UI
                  image: dbImage || imageMap[v.imageKey] || hondaCityImg,
                  images: allDbImages || (v.images) || [], // Keep the original array if it exists
                  hourlyRate: v.hourlyRate || (v.price && v.price.includes('/') ? parseInt(v.price.split('/')[0]) : v.price) || 0,
                  dayRate: v.dayRate || (v.price && v.price.includes('/') ? parseInt(v.price.split('/')[0]) * 10 : 0) || 0,
                  rating: v.rating || 4.5,
                  location: v.location || 'Bangalore',
                  category: v.category?.toLowerCase() === 'vehicle' ? (v.subcategory?.toLowerCase() + 's') : v.category, // Handle "Vehicle" category
                  specifications: v.specifications || { 
                    fuelType: v.subcategory === 'EV' ? 'Electric' : 'Petrol',
                    transmission: 'Automatic',
                    seatingCapacity: 2
                  }
              };
          });
          setDbVehicles(mappedData);
        }
      } catch (error) {
        console.error("Failed to fetch vehicles from DB:", error);
      }
    };
    fetchVehicles();
  }, [activeCategory]);

  const filtered = useMemo(() => {
    let result = [...dbVehicles];

    if (activeCategory !== 'all') {
      result = result.filter((item) => item?.category === activeCategory);
    }

    if (searchFilters.location && searchFilters.location.trim() !== '') {
      const q = searchFilters.location.toLowerCase().trim();
      
      // Keyword-based suitability mapping
      const getSuitabilityScore = (item, query) => {
        const subcat = (item?.subcategory || "").toLowerCase();
        const terrain = {
          hills: ['manali', 'leh', 'shimla', 'kasol', 'mountains', 'hill', 'coorg', 'munnar'],
          city: ['mumbai', 'bangalore', 'delhi', 'pune', 'downtown', 'traffic', 'tech park'],
          coastal: ['goa', 'pondy', 'varkala', 'beach', 'coast']
        };

        if (terrain.hills.some(k => query.includes(k))) {
          if (subcat.includes('suv')) return 10;
          if (item?.name?.toLowerCase().includes('enfield')) return 8;
        }
        if (terrain.city.some(k => query.includes(k))) {
          if (subcat.includes('ev')) return 10;
          if (subcat.includes('scooter')) return 7;
        }
        if (terrain.coastal.some(k => query.includes(k))) {
          if (subcat.includes('scooter')) return 10;
        }
        return 0;
      };

      // 1. Filter: Check if any field contains the query
      result = result.filter((item) => {
        const loc = (item?.location || "").toLowerCase();
        const name = (item?.name || "").toLowerCase();
        const title = (item?.title || "").toLowerCase();
        const tagline = (item?.tagline || "").toLowerCase();
        const subcat = (item?.subcategory || "").toLowerCase();
        
        return loc.includes(q) || 
               name.includes(q) || 
               title.includes(q) || 
               tagline.includes(q) || 
               subcat.includes(q);
      });

      // 2. Priority Sorting: Show "Suitable" and "Best" results first
      result = [...result].sort((a, b) => {
        // First check Suitability (e.g. SUVs for Hills)
        const scoreA = getSuitabilityScore(a, q);
        const scoreB = getSuitabilityScore(b, q);
        if (scoreA !== scoreB) return scoreB - scoreA;

        const locA = (a?.location || "").toLowerCase();
        const locB = (b?.location || "").toLowerCase();
        
        // Then Exact Location match
        if (locA === q && locB !== q) return -1;
        if (locB === q && locA !== q) return 1;

        // Then starts with query
        if (locA.startsWith(q) && !locB.startsWith(q)) return -1;
        if (locB.startsWith(q) && !locA.startsWith(q)) return 1;

        return 0;
      });
    }

    if (searchFilters.guests && searchFilters.guests > 1) {
      result = result.filter((item) =>
        (item?.specifications?.seatingCapacity || 1) >= searchFilters.guests
      );
    }

    if (sortOrder === 'low') result.sort((a, b) => (a?.hourlyRate || 0) - (b?.hourlyRate || 0));
    if (sortOrder === 'high') result.sort((a, b) => (b?.hourlyRate || 0) - (a?.hourlyRate || 0));

    return result;
  }, [activeCategory, sortOrder, dbVehicles, searchFilters]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  // Pagination slice matching Dwellings logic
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (fleetRef.current) {
      fleetRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleToggleCompare = (vehicle) => {
    setCompareList((prev) => {
      const exists = prev.find(v => v.id === vehicle.id);
      if (exists) {
        return prev.filter(v => v.id !== vehicle.id);
      } else {
        if (prev.length > 0 && prev[0].category !== vehicle.category) {
          alert(`Please compare only ${prev[0].category} vehicles together.`);
          return prev;
        }
        if (prev.length >= 3) {
          setShowMaxComparePopup(true);
          return prev;
        }
        return [...prev, vehicle];
      }
    });
  };

  const scrollToFleet = () => {
    if (fleetRef.current) {
      fleetRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearch = (filters) => {
    setSearchFilters(filters);
    setCurrentPage(1);
    scrollToFleet();
  };

  

  const categories = [
    { key: 'cars', label: 'Cars', heading: 'Premium cars for every journey', description: 'From compact city cars to luxury SUVs. Find the perfect car rental for your needs.' },
    { key: 'bikes', label: 'Bikes', heading: 'Two-wheelers ready to ride', description: 'Explore the city on two wheels. Browse our collection of bikes and scooters.' },
    { key: 'evs', label: 'EVs', heading: 'Go green with electric vehicles', description: 'Eco-friendly electric vehicles for a sustainable ride. Zero emissions, full adventure.' },
    { key: 'bicycles', label: 'Bicycles', heading: 'Pedal-powered adventures', description: 'Mountain bikes, city cruisers, and more. Rent a bicycle for your next outdoor adventure.' },
  ];

  const currentCategory = categories.find(c => c.key === activeCategory);
  
  // Detail View Overlay
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

      {/* Category tabs and content layout — Dwellings style */}
      <div className="drv-section-container drv-tabs-content-wrapper">
        {/* Left side - Category tabs */}
        <aside className="drv-category-tabs-sidebar">
          <div className="drv-category-tabs">
            {categories.map((cat) => (
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

        {/* Right side - Content */}
        <div className="drv-category-content">
          {/* Category heading and description */}
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
              <span>Driving License verification</span> is mandatory for all vehicle rentals. Please keep your valid ID details handy.
            </p>
          </div>

          {/* Results count */}
          <div className="drv-count-container">
            <p className="drv-results-count">
              Showing <span>{filtered.length}</span> {activeCategory !== 'all' ? activeCategory : 'vehicles'}
            </p>
            {compareCategory && (
              <p className="drv-results-count" style={{ marginTop: '0.25rem' }}>
                Comparing only <span>{compareCategory}</span> vehicles
              </p>
            )}
          </div>

          {/* Vehicle Comparison */}
          {compareList.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <VehicleComparison
                vehicles={compareList}
                onRemove={(id) => setCompareList(prev => prev.filter(v => v.id !== id))}
              />
            </div>
          )}

          {/* Listing grid */}
          <main className="drv-main-content" ref={fleetRef}>
            {paginated.length > 0 ? (
              <div className="drv-listings-grid">
                {paginated.map((driveable, index) => (
                  <DriveableCard
                    key={driveable.id}
                    driveable={driveable}
                    index={index}
                    onViewDetails={() => setSelectedDriveable(driveable)
                    }
                    onToggleCompare={handleToggleCompare}
                    isSelectedForComparison={compareList.some(v => v.id === driveable.id)}
                    isCompareDisabled={Boolean(compareCategory) && compareCategory !== driveable.category && !compareList.some(v => v.id === driveable.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="drv-empty-state">
                <p>No vehicles found matching your criteria.</p>
              </div>
            )}
          </main>

          {totalPages > 1 && (
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

      {showMaxComparePopup && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="max-compare-title"
          className="d-flex align-items-center justify-content-center"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            zIndex: 1200,
            padding: '1rem',
          }}
          onClick={() => setShowMaxComparePopup(false)}
        >
          <div
            className="bg-white rounded-4 shadow-lg p-4"
            style={{ width: '100%', maxWidth: '420px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 id="max-compare-title" className="fw-bold mb-2">Comparison limit reached</h5>
            <p className="text-muted mb-4">You can compare up to 3 vehicles at a time.</p>
            <button
              className="btn btn-primary w-100"
              onClick={() => setShowMaxComparePopup(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriveablesMain;