import { useState, useMemo, useRef } from 'react';
import { Shield } from 'lucide-react';

// Component Imports
import Navbar from './Navbar';
import Header from '../components/Header/Header';
import HeroSection from './HeroSection';
import DriveableCard from './DriveableCard';
import DriveableDetail from './DriveableDetail';
import Pagination from './Pagination';
import Footer from '../components/Footer/Footer';
import VehicleComparison from '../components/VehicleComparison/VehicleComparison';

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

const mockData = [
  { id: 1, name: 'Honda City', category: 'cars', image: hondaCityImg, hourlyRate: 15, dayRate: 100, rating: 4.5, location: 'Downtown', specifications: { fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5 } },
  { id: 2, name: 'Royal Enfield Classic 350', category: 'bikes', image: royalEnfieldImg, hourlyRate: 8, dayRate: 50, rating: 4.7, location: 'East Side', specifications: { fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 2 } },
  { id: 3, name: 'Tesla Model 3', category: 'evs', image: teslaImg, hourlyRate: 25, dayRate: 180, rating: 4.9, location: 'Tech Park', specifications: { fuelType: 'Electric', transmission: 'Automatic', seatingCapacity: 5, range: '350 km' } },
  { id: 4, name: 'Mountain Bike Pro', category: 'bicycles', image: mountainBikeImg, hourlyRate: 3, dayRate: 15, rating: 4.3, location: 'Park Area', specifications: { type: 'Mountain', gears: '21-speed', frameMaterial: 'Aluminum' } },
  { id: 5, name: 'Activa 6G', category: 'bikes', image: activa6gImg, hourlyRate: 5, dayRate: 30, rating: 4.4, location: 'Central', specifications: { fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 2 } },
  { id: 6, name: 'Ola S1 Pro', category: 'evs', image: olaS1ProImg, hourlyRate: 6, dayRate: 40, rating: 4.6, location: 'West End', specifications: { fuelType: 'Electric', transmission: 'Automatic', seatingCapacity: 2, range: '180 km' } },
  { id: 7, name: 'Maruti Swift', category: 'cars', image: marutiSwiftImg, hourlyRate: 12, dayRate: 80, rating: 4.4, location: 'North Zone', specifications: { fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 5 } },
  { id: 8, name: 'City Bicycle', category: 'bicycles', image: cityBicycleImg, hourlyRate: 2, dayRate: 10, rating: 4.1, location: 'City Center', specifications: { type: 'City', gears: 'Single-speed', frameMaterial: 'Steel' } },
  { id: 9, name: 'Hyundai Creta', category: 'cars', image: cretaImg, hourlyRate: 18, dayRate: 120, rating: 4.6, location: 'Airport Road', specifications: { fuelType: 'Diesel', transmission: 'Automatic', seatingCapacity: 5 } },
  { id: 10, name: 'Bajaj Pulsar 150', category: 'bikes', image: bajajPulsarImg, hourlyRate: 6, dayRate: 35, rating: 4.3, location: 'South Gate', specifications: { fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 2 } },
  { id: 11, name: 'MG ZS EV', category: 'evs', image: MGZsEVImg, hourlyRate: 20, dayRate: 140, rating: 4.5, location: 'Green Valley', specifications: { fuelType: 'Electric', transmission: 'Automatic', seatingCapacity: 5, range: '460 km' } },
  { id: 12, name: 'Hybrid Road Bike', category: 'bicycles', image: hybridBikkeImg, hourlyRate: 4, dayRate: 20, rating: 4.4, location: 'Lake Side', specifications: { type: 'Hybrid', gears: '18-speed', frameMaterial: 'Carbon Fiber' } },
  { id: 13, name: 'Toyota Fortuner', category: 'cars', image: toyotaFortunerImg, hourlyRate: 30, dayRate: 220, rating: 4.8, location: 'Highway Hub', specifications: { fuelType: 'Diesel', transmission: 'Automatic', seatingCapacity: 7 } },
  { id: 14, name: 'TVS Jupiter', category: 'bikes', image: jupiterImg, hourlyRate: 4, dayRate: 25, rating: 4.2, location: 'Market Square', specifications: { fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 2 } },
  { id: 15, name: 'Ather 450X', category: 'evs', image: ather450Img, hourlyRate: 7, dayRate: 45, rating: 4.7, location: 'Eco Park', specifications: { fuelType: 'Electric', transmission: 'Automatic', seatingCapacity: 2, range: '150 km' } },
  { id: 16, name: 'BMX Freestyle', category: 'bicycles', image: bmxBikeImg, hourlyRate: 3, dayRate: 18, rating: 4.0, location: 'Sports Arena', specifications: { type: 'BMX', gears: 'Single-speed', frameMaterial: 'Chromoly' } },
  { id: 17, name: 'Tata Nexon EV', category: 'evs', image: tataNexomImg, hourlyRate: 16, dayRate: 110, rating: 4.5, location: 'Riverside', specifications: { fuelType: 'Electric', transmission: 'Automatic', seatingCapacity: 5, range: '312 km' } },
  { id: 18, name: 'KTM Duke 200', category: 'bikes', image: ktmDukeImg, hourlyRate: 10, dayRate: 60, rating: 4.6, location: 'Race Track', specifications: { fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 2 } },
  { id: 19, name: 'Kia Seltos', category: 'cars', image: KiaSeltosImg, hourlyRate: 14, dayRate: 95, rating: 4.5, location: 'University Area', specifications: { fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5 } },
  { id: 20, name: 'Gravel Adventure Bike', category: 'bicycles', image: gravelBikeImg, hourlyRate: 5, dayRate: 25, rating: 4.3, location: 'Trail Head', specifications: { type: 'Gravel', gears: '24-speed', frameMaterial: 'Aluminum' } }
];

const ITEMS_PER_PAGE = 6;

const DriveablesMain = () => {
  // State matched to Dwellings index.tsx logic
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDriveable, setSelectedDriveable] = useState(null);
  const [sortOrder, setSortOrder] = useState('default');
  const [compareList, setCompareList] = useState([]);
  const [searchFilters, setSearchFilters] = useState({ location: '', guests: 1 });
  
  const fleetRef = useRef(null);

  // useMemo used just like the filtered variable in Dwellings
  const filtered = useMemo(() => {
    let result = [...mockData];
    
    // Category Filter
    if (activeCategory !== 'all') {
      result = result.filter((item) => item.category === activeCategory);
    }

    // Search Location Filter
    if (searchFilters.location && searchFilters.location.trim() !== '') {
      const q = searchFilters.location.toLowerCase();
      result = result.filter((item) => 
        item.location.toLowerCase().includes(q) || 
        item.name.toLowerCase().includes(q)
      );
    }

    // Guests / Seating Capacity Filter
    if (searchFilters.guests && searchFilters.guests > 1) {
      result = result.filter((item) => 
        (item.specifications.seatingCapacity || 1) >= searchFilters.guests
      );
    }
    
    // Sorting Logic
    if (sortOrder === 'low') result.sort((a, b) => a.hourlyRate - b.hourlyRate);
    if (sortOrder === 'high') result.sort((a, b) => b.hourlyRate - a.hourlyRate);
    
    return result;
  }, [activeCategory, sortOrder]);

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
        if (prev.length >= 3) {
          alert("You can compare up to 3 vehicles at a time.");
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
    <div className="bg-light min-vh-100">
      <Header />
      
      {/* Passing onExplore to HeroSection to maintain your original scroll functionality */}
      <HeroSection 
        onExplore={scrollToFleet} 
        activeCategory={activeCategory} 
        onCategoryChange={handleCategoryChange} 
        onSearchClick={handleSearch}
      />
      
     

      {/* Mandatory Notice Box (Mirrors the Aadhar notice from Dwellings) */}
      <div className="container mt-4">
        <div className="alert alert-warning d-flex align-items-center mb-0 border-warning py-2 shadow-sm" role="alert">
          <Shield className="text-success me-2 flex-shrink-0" size={20} />
          <p className="mb-0 small text-dark">
            <span className="fw-bold">Driving License verification</span> is mandatory for all vehicle rentals. Please keep your valid ID details handy.
          </p>
        </div>
      </div>
      
      {/* Vehicle Comparison Component */}
      {compareList.length > 0 && (
        <div className="container mt-4">
          <VehicleComparison 
            vehicles={compareList} 
            onRemove={(id) => setCompareList(prev => prev.filter(v => v.id !== id))} 
          />
        </div>
      )}

      {/* Results Count Text */}
      <div className="container mt-4 mb-3">
        <p className="text-muted small mb-0">
          Showing <span className="fw-bold text-dark">{filtered.length}</span> {activeCategory !== 'all' ? `${activeCategory}` : "vehicles"}
        </p>
      </div>

      {/* Main Listing Grid */}
      <main className="container pb-5" ref={fleetRef}>
        {paginated.length > 0 ? (
          <div className="row g-4">
            {paginated.map((driveable, index) => (
              <div key={driveable.id} className="col-12 col-md-6 col-lg-4">
                <DriveableCard 
                  driveable={driveable}
                  index={index}
                  onViewDetails={() => setSelectedDriveable(driveable)}
                  onToggleCompare={handleToggleCompare}
                  isSelectedForComparison={compareList.some(v => v.id === driveable.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <p className="fs-5 text-muted">No vehicles found matching your criteria.</p>
          </div>
        )}
      </main>

      {/* Pagination Component */}
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={filtered.length}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default DriveablesMain;