import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellerName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Dwelling", "Vehicle"],
      required: true,
    },
    subcategory: {
      type: String,
      enum: ["Villa", "Flat", "PG", "Travel Stay", "Cars", "EV", "Bike", "Bicycle"],
      required: true,
    },
    tagline: {
      type: String,
      default: "",
    },
    price: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    availableDates: {
      type: String,
      default: "",
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    bookings: [
      {
        userId: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Listing", listingSchema);
