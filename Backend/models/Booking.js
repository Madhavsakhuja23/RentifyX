import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // User-side booking fields (from main)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    checkIn: {
      type: Date,
    },
    checkOut: {
      type: Date,
    },
    guests: {
      adults: { type: Number, default: 1 },
      children: { type: Number, default: 0 },
      infants: { type: Number, default: 0 },
    },
    totalPrice: {
      type: Number,
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "cancelled"],
      default: "paid",
    },
    utr: {
      type: String,
    },

    // Seller-dashboard fields (from HEAD)
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    renterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    totalAmount: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["ongoing", "completed", "cancelled"],
      default: "ongoing",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
