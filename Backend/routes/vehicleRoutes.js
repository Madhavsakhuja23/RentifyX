import express from 'express';
import Vehicle from '../models/Vehicle.js';

const router = express.Router();

// Seed route to safely populate MongoDB with all 20 Driveables with imageKey
router.post('/seed', async (req, res) => {
    const sampleData = [
        { name: 'Honda City', category: 'cars', imageKey: 'hondaCityImg', hourlyRate: 200, dayRate: 2000, rating: 4.5, location: 'Downtown', specifications: { fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, mileage: '18 kmpl', engine: '1498 cc', deposit: 5000, freeKms: 120 } },
        { name: 'Royal Enfield Classic 350', category: 'bikes', imageKey: 'royalEnfieldImg', hourlyRate: 80, dayRate: 800, rating: 4.7, location: 'East Side', specifications: { fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 2, mileage: '35 kmpl', engine: '349 cc', deposit: 2000, freeKms: 100 } },
        { name: 'Tesla Model 3', category: 'evs', imageKey: 'teslaImg', hourlyRate: 500, dayRate: 5000, rating: 4.9, location: 'Tech Park', specifications: { fuelType: 'Electric', transmission: 'Automatic', seatingCapacity: 5, range: '350 km', engine: 'Electric Motor', deposit: 10000, freeKms: 150 } },
        { name: 'Mountain Bike Pro', category: 'bicycles', imageKey: 'mountainBikeImg', hourlyRate: 50, dayRate: 250, rating: 4.3, location: 'Park Area', specifications: { type: 'Mountain', gears: '21-speed', frameMaterial: 'Aluminum', deposit: 500, freeKms: 'Unlimited' } },
        { name: 'Activa 6G', category: 'bikes', imageKey: 'activa6gImg', hourlyRate: 40, dayRate: 400, rating: 4.4, location: 'Central', specifications: { fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 2, mileage: '50 kmpl', engine: '109 cc', deposit: 1000, freeKms: 80 } },
        { name: 'Ola S1 Pro', category: 'evs', imageKey: 'olaS1ProImg', hourlyRate: 60, dayRate: 600, rating: 4.6, location: 'West End', specifications: { fuelType: 'Electric', transmission: 'Automatic', seatingCapacity: 2, range: '180 km', engine: '8.5 kW Motor', deposit: 1500, freeKms: 100 } },
        { name: 'Maruti Swift', category: 'cars', imageKey: 'marutiSwiftImg', hourlyRate: 150, dayRate: 1500, rating: 4.4, location: 'North Zone', specifications: { fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 5, mileage: '22 kmpl', engine: '1197 cc', deposit: 3000, freeKms: 150 } },
        { name: 'City Bicycle', category: 'bicycles', imageKey: 'cityBicycleImg', hourlyRate: 20, dayRate: 100, rating: 4.1, location: 'City Center', specifications: { type: 'City', gears: 'Single-speed', frameMaterial: 'Steel', deposit: 300, freeKms: 'Unlimited' } },
        { name: 'Hyundai Creta', category: 'cars', imageKey: 'cretaImg', hourlyRate: 250, dayRate: 2500, rating: 4.6, location: 'Airport Road', specifications: { fuelType: 'Diesel', transmission: 'Automatic', seatingCapacity: 5, mileage: '17 kmpl', engine: '1493 cc', deposit: 6000, freeKms: 120 } },
        { name: 'Bajaj Pulsar 150', category: 'bikes', imageKey: 'bajajPulsarImg', hourlyRate: 60, dayRate: 600, rating: 4.3, location: 'South Gate', specifications: { fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 2, mileage: '45 kmpl', engine: '149 cc', deposit: 1500, freeKms: 100 } },
        { name: 'MG ZS EV', category: 'evs', imageKey: 'MGZsEVImg', hourlyRate: 300, dayRate: 3000, rating: 4.5, location: 'Green Valley', specifications: { fuelType: 'Electric', transmission: 'Automatic', seatingCapacity: 5, range: '460 km', engine: '130 kW Motor', deposit: 8000, freeKms: 150 } },
        { name: 'Hybrid Road Bike', category: 'bicycles', imageKey: 'hybridBikkeImg', hourlyRate: 40, dayRate: 200, rating: 4.4, location: 'Lake Side', specifications: { type: 'Hybrid', gears: '18-speed', frameMaterial: 'Carbon Fiber', deposit: 1000, freeKms: 'Unlimited' } },
        { name: 'Toyota Fortuner', category: 'cars', imageKey: 'toyotaFortunerImg', hourlyRate: 500, dayRate: 5000, rating: 4.8, location: 'Highway Hub', specifications: { fuelType: 'Diesel', transmission: 'Automatic', seatingCapacity: 7, mileage: '10 kmpl', engine: '2755 cc', deposit: 15000, freeKms: 200 } },
        { name: 'TVS Jupiter', category: 'bikes', imageKey: 'jupiterImg', hourlyRate: 40, dayRate: 400, rating: 4.2, location: 'Market Square', specifications: { fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 2, mileage: '50 kmpl', engine: '109 cc', deposit: 1000, freeKms: 80 } },
        { name: 'Ather 450X', category: 'evs', imageKey: 'ather450Img', hourlyRate: 70, dayRate: 700, rating: 4.7, location: 'Eco Park', specifications: { fuelType: 'Electric', transmission: 'Automatic', seatingCapacity: 2, range: '150 km', engine: '6.2 kW Motor', deposit: 2000, freeKms: 100 } },
        { name: 'BMX Freestyle', category: 'bicycles', imageKey: 'bmxBikeImg', hourlyRate: 30, dayRate: 150, rating: 4.0, location: 'Sports Arena', specifications: { type: 'BMX', gears: 'Single-speed', frameMaterial: 'Chromoly', deposit: 400, freeKms: 'Unlimited' } },
        { name: 'Tata Nexon EV', category: 'evs', imageKey: 'tataNexomImg', hourlyRate: 200, dayRate: 2000, rating: 4.5, location: 'Riverside', specifications: { fuelType: 'Electric', transmission: 'Automatic', seatingCapacity: 5, range: '312 km', engine: '95 kW Motor', deposit: 5000, freeKms: 150 } },
        { name: 'KTM Duke 200', category: 'bikes', imageKey: 'ktmDukeImg', hourlyRate: 100, dayRate: 1000, rating: 4.6, location: 'Race Track', specifications: { fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 2, mileage: '30 kmpl', engine: '199 cc', deposit: 2500, freeKms: 100 } },
        { name: 'Kia Seltos', category: 'cars', imageKey: 'KiaSeltosImg', hourlyRate: 220, dayRate: 2200, rating: 4.5, location: 'University Area', specifications: { fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, mileage: '16 kmpl', engine: '1497 cc', deposit: 5000, freeKms: 120 } },
        { name: 'Gravel Adventure Bike', category: 'bicycles', imageKey: 'gravelBikeImg', hourlyRate: 50, dayRate: 250, rating: 4.3, location: 'Trail Head', specifications: { type: 'Gravel', gears: '24-speed', frameMaterial: 'Aluminum', deposit: 700, freeKms: 'Unlimited' } }
    ];
    try {
        await Vehicle.deleteMany({}); // Clear old data
        const added = await Vehicle.insertMany(sampleData);
        res.json({ message: "Seeded successfully", count: added.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all vehicles
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        const filter = (category && category !== 'all') ? { category } : {};
        const vehicles = await Vehicle.find(filter);
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Book a vehicle with conflict resolution
router.post('/book/:id', async (req, res) => {
    const { userId, startDate, endDate } = req.body;
    const { id } = req.params;

    try {
        // Find vehicle and ensure NO existing booking overlaps with requests
        const start = new Date(startDate);
        const end = new Date(endDate);

        const vehicle = await Vehicle.findOneAndUpdate(
            { 
                _id: id, 
                // Ensure no booking overlaps
                bookings: {
                    $not: {
                        $elemMatch: {
                            startDate: { $lt: end },
                            endDate: { $gt: start }
                        }
                    }
                }
            },
            { 
                $push: { bookings: { userId: userId || 'testUser', startDate: start, endDate: end } }
            },
            { new: true }
        );

        if (!vehicle) {
            return res.status(409).json({ 
                message: "Conflict: This vehicle is already booked during this time period!" 
            });
        }

        res.json({ message: "Booking successful", vehicle });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
