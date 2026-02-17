import { useState, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import DriveableCard from './DriveableCard';
import DriveableDetail from './DriveableDetail';
import Pagination from './Pagination';
import './Driveables.css';

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
      {
        id: 1,
        name: 'Honda City',
        category: 'cars',
        image: hondaCityImg,
        hourlyRate: 15,
        dayRate: 100,
        rating: 4.5,
        location: 'Downtown',
        specifications: {
          fuelType: 'Petrol',
          transmission: 'Automatic',
          seatingCapacity: 5
        }
      },
      {
        id: 2,
        name: 'Royal Enfield Classic 350',
        category: 'bikes',
        image: royalEnfieldImg,
        hourlyRate: 8,
        dayRate: 50,
        rating: 4.7,
        location: 'East Side',
        specifications: {
          fuelType: 'Petrol',
          transmission: 'Manual',
          seatingCapacity: 2
        }
      },
      {
        id: 3,
        name: 'Tesla Model 3',
        category: 'evs',
        image: teslaImg,
        hourlyRate: 25,
        dayRate: 180,
        rating: 4.9,
        location: 'Tech Park',
        specifications: {
          fuelType: 'Electric',
          transmission: 'Automatic',
          seatingCapacity: 5,
          range: '350 km'
        }
      },
      {
        id: 4,
        name: 'Mountain Bike Pro',
        category: 'bicycles',
        image: mountainBikeImg,
        hourlyRate: 3,
        dayRate: 15,
        rating: 4.3,
        location: 'Park Area',
        specifications: {
          type: 'Mountain',
          gears: '21-speed',
          frameMaterial: 'Aluminum'
        }
      },
      {
        id: 5,
        name: 'Activa 6G',
        category: 'bikes',
        image: activa6gImg,
        hourlyRate: 5,
        dayRate: 30,
        rating: 4.4,
        location: 'Central',
        specifications: {
          fuelType: 'Petrol',
          transmission: 'Automatic',
          seatingCapacity: 2
        }
      },
      {
        id: 6,
        name: 'Ola S1 Pro',
        category: 'evs',
        image: olaS1ProImg,
        hourlyRate: 6,
        dayRate: 40,
        rating: 4.6,
        location: 'West End',
        specifications: {
          fuelType: 'Electric',
          transmission: 'Automatic',
          seatingCapacity: 2,
          range: '180 km'
        }
      },
      {
        id: 7,
        name: 'Maruti Swift',
        category: 'cars',
        image: marutiSwiftImg,
        hourlyRate: 12,
        dayRate: 80,
        rating: 4.4,
        location: 'North Zone',
        specifications: {
          fuelType: 'Petrol',
          transmission: 'Manual',
          seatingCapacity: 5
        }
      },
      {
        id: 8,
        name: 'City Bicycle',
        category: 'bicycles',
        image: cityBicycleImg,
        hourlyRate: 2,
        dayRate: 10,
        rating: 4.1,
        location: 'City Center',
        specifications: {
          type: 'City',
          gears: 'Single-speed',
          frameMaterial: 'Steel'
        }
      },
      {
        id: 9,
        name: 'Hyundai Creta',
        category: 'cars',
        image: cretaImg,
        hourlyRate: 18,
        dayRate: 120,
        rating: 4.6,
        location: 'Airport Road',
        specifications: {
          fuelType: 'Diesel',
          transmission: 'Automatic',
          seatingCapacity: 5
        }
      },
      {
        id: 10,
        name: 'Bajaj Pulsar 150',
        category: 'bikes',
        image: bajajPulsarImg,
        hourlyRate: 6,
        dayRate: 35,
        rating: 4.3,
        location: 'South Gate',
        specifications: {
          fuelType: 'Petrol',
          transmission: 'Manual',
          seatingCapacity: 2
        }
      },
      {
        id: 11,
        name: 'MG ZS EV',
        category: 'evs',
        image: MGZsEVImg,
        hourlyRate: 20,
        dayRate: 140,
        rating: 4.5,
        location: 'Green Valley',
        specifications: {
          fuelType: 'Electric',
          transmission: 'Automatic',
          seatingCapacity: 5,
          range: '460 km'
        }
      },
      {
        id: 12,
        name: 'Hybrid Road Bike',
        category: 'bicycles',
        image: hybridBikkeImg,
        hourlyRate: 4,
        dayRate: 20,
        rating: 4.4,
        location: 'Lake Side',
        specifications: {
          type: 'Hybrid',
          gears: '18-speed',
          frameMaterial: 'Carbon Fiber'
        }
      },
      {
        id: 13,
        name: 'Toyota Fortuner',
        category: 'cars',
        image: toyotaFortunerImg,
        hourlyRate: 30,
        dayRate: 220,
        rating: 4.8,
        location: 'Highway Hub',
        specifications: {
          fuelType: 'Diesel',
          transmission: 'Automatic',
          seatingCapacity: 7
        }
      },
      {
        id: 14,
        name: 'TVS Jupiter',
        category: 'bikes',
        image: jupiterImg,
        hourlyRate: 4,
        dayRate: 25,
        rating: 4.2,
        location: 'Market Square',
        specifications: {
          fuelType: 'Petrol',
          transmission: 'Automatic',
          seatingCapacity: 2
        }
      },
      {
        id: 15,
        name: 'Ather 450X',
        category: 'evs',
        image: ather450Img,
        hourlyRate: 7,
        dayRate: 45,
        rating: 4.7,
        location: 'Eco Park',
        specifications: {
          fuelType: 'Electric',
          transmission: 'Automatic',
          seatingCapacity: 2,
          range: '150 km'
        }
      },
      {
        id: 16,
        name: 'BMX Freestyle',
        category: 'bicycles',
        image: bmxBikeImg,
        hourlyRate: 3,
        dayRate: 18,
        rating: 4.0,
        location: 'Sports Arena',
        specifications: {
          type: 'BMX',
          gears: 'Single-speed',
          frameMaterial: 'Chromoly'
        }
      },
      {
        id: 17,
        name: 'Tata Nexon EV',
        category: 'evs',
        image: tataNexomImg,
        hourlyRate: 16,
        dayRate: 110,
        rating: 4.5,
        location: 'Riverside',
        specifications: {
          fuelType: 'Electric',
          transmission: 'Automatic',
          seatingCapacity: 5,
          range: '312 km'
        }
      },
      {
        id: 18,
        name: 'KTM Duke 200',
        category: 'bikes',
        image: ktmDukeImg,
        hourlyRate: 10,
        dayRate: 60,
        rating: 4.6,
        location: 'Race Track',
        specifications: {
          fuelType: 'Petrol',
          transmission: 'Manual',
          seatingCapacity: 2
        }
      },
      {
        id: 19,
        name: 'Kia Seltos',
        category: 'cars',
        image: KiaSeltosImg,
        hourlyRate: 14,
        dayRate: 95,
        rating: 4.5,
        location: 'University Area',
        specifications: {
          fuelType: 'Petrol',
          transmission: 'Automatic',
          seatingCapacity: 5
        }
      },
      {
        id: 20,
        name: 'Gravel Adventure Bike',
        category: 'bicycles',
        image: gravelBikeImg,
        hourlyRate: 5,
        dayRate: 25,
        rating: 4.3,
        location: 'Trail Head',
        specifications: {
          type: 'Gravel',
          gears: '24-speed',
          frameMaterial: 'Aluminum'
        }
      }
];

const DriveablesMain = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDriveable, setSelectedDriveable] = useState(null);
  const [sortOrder, setSortOrder] = useState('default');
  const itemsPerPage = 6;
  const fleetRef = useRef(null);

  const filteredDriveables = selectedCategory === 'all' 
    ? mockData 
    : mockData.filter(item => item.category === selectedCategory);

  const sortedDriveables = [...filteredDriveables].sort((a, b) => {
    if (sortOrder === 'low') return a.hourlyRate - b.hourlyRate;
    if (sortOrder === 'high') return b.hourlyRate - a.hourlyRate;
    return 0;
  });

  const totalPages = Math.ceil(sortedDriveables.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDriveables = sortedDriveables.slice(startIndex, startIndex + itemsPerPage);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (fleetRef.current) {
      fleetRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToFleet = () => {
    if (fleetRef.current) {
      fleetRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If a vehicle is selected, show detail page
  if (selectedDriveable) {
    return (
      <>
        <Navbar selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
        <DriveableDetail 
          driveable={selectedDriveable} 
          onClose={() => setSelectedDriveable(null)} 
        />
      </>
    );
  }

  return (
    <motion.div 
      className="driveables-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
      <HeroSection onExplore={scrollToFleet} />

      {/* Fleet Section */}
      <div ref={fleetRef} id="fleet">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag">Our Collection</span>
          <h2>Browse Our <span className="highlight">Fleet</span></h2>
          <p>Choose from our wide selection of premium vehicles for any occasion</p>
        </motion.div>

        <div className="driveables-main-content">
          <motion.div 
            className="driveables-content"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.div className="results-info" layout>
              <p>Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, sortedDriveables.length)} of {sortedDriveables.length} vehicles</p>
              <div className="sort-control">
                <label htmlFor="sort-select">Sort by:</label>
                <select id="sort-select" value={sortOrder} onChange={handleSortChange} className="sort-select">
                  <option value="default">Default</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                </select>
              </div>
            </motion.div>

            <motion.div className="driveables-grid" layout>
              {currentDriveables.map((driveable, index) => (
                <DriveableCard 
                  key={driveable.id}
                  driveable={driveable}
                  index={index}
                  onViewDetails={() => setSelectedDriveable(driveable)}
                />
              ))}
            </motion.div>

            <AnimatePresence>
              {currentDriveables.length === 0 && (
                <motion.div 
                  className="no-results"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <p>No vehicles found for this category.</p>
                </motion.div>
              )}
            </AnimatePresence>

            {totalPages > 1 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={sortedDriveables.length}
                itemsPerPage={itemsPerPage}
              />
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default DriveablesMain;
