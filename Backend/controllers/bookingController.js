import Booking from "../models/Booking.js";
import mongoose from "mongoose";

// GET /api/bookings/history/:sellerId
export const getRentalHistory = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { status, type, from, to } = req.query;

    const matchStage = {
      sellerId: new mongoose.Types.ObjectId(sellerId),
    };

    if (status) matchStage.status = status;
    
    if (from || to) {
      matchStage.createdAt = {};
      if (from) matchStage.createdAt.$gte = new Date(from);
      if (to) matchStage.createdAt.$lte = new Date(to);
    }

    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: "users",
          localField: "renterId",
          foreignField: "_id",
          as: "renter",
        },
      },
      {
        $lookup: {
          from: "listings",
          localField: "listingId",
          foreignField: "_id",
          as: "listing",
        },
      },
      { $unwind: "$renter" },
      { $unwind: "$listing" },
    ];

    if (type) {
      pipeline.push({
        $match: { "listing.category": type },
      });
    }

    pipeline.push({ $sort: { createdAt: -1 } });

    const bookings = await Booking.aggregate(pipeline);

    const totalEarnings = bookings.reduce((sum, b) => {
      if (b.status === "completed") return sum + b.totalAmount;
      return sum;
    }, 0);

    res.json({ bookings, totalEarnings });
  } catch (err) {
    console.error("Error fetching rental history:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
