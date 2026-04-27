import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    imageKey: { type: String },
    hourlyRate: { type: Number },
    dayRate: { type: Number },
    rating: { type: Number },
    specifications: { type: mongoose.Schema.Types.Mixed },
    status: { 
        type: String, 
        enum: ['available', 'booked', 'maintenance'], 
        default: 'available' 
    },
    bookings: [
        {
            userId: { type: String },
            startDate: { type: Date },
            endDate: { type: Date }
        }
    ],
    currentBooking: {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        expiresAt: { type: Date }
    },
    version: { type: Number, default: 0 } // For optimistic concurrency control
}, { timestamps: true, strict: false });

export default mongoose.model('Vehicle', vehicleSchema);
