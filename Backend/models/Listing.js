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
      type: Number,
      required: true,
    },
    timespan: {
      type: String,
      enum: ["hour", "night", "week", "month"],
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
    // Seller dashboard fields (from HEAD)
    isAvailable: {
      type: Boolean,
      default: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Listing", listingSchema);
