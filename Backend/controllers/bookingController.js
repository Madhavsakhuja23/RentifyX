import Booking from "../models/Booking.js";
import mongoose from "mongoose";

// GET /api/bookings/history — Seller rental history with filters
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

// POST /api/bookings/check-availability
export const checkAvailability = async (req, res) => {
  try {
    const { listingId, checkIn, checkOut } = req.body;

    if (!listingId || !checkIn || !checkOut) {
      return res.status(400).json({ msg: "Please provide listingId, checkIn and checkOut dates." });
    }

    const newCheckIn = new Date(checkIn);
    const newCheckOut = new Date(checkOut);

    const overlapping = await Booking.find({
      listingId,
      $or: [
        {
          checkIn: { $lt: newCheckOut },
          checkOut: { $gt: newCheckIn },
        },
      ],
    });

    if (overlapping.length > 0) {
      return res.json({
        available: false,
        conflictingDates: overlapping.map((b) => ({ checkIn: b.checkIn, checkOut: b.checkOut })),
      });
    }

    res.json({ available: true });
  } catch (err) {
    console.error("Check availability error:", err);
    res.status(500).json({ msg: "Server error during availability check" });
  }
};

// POST /api/bookings — Create a new booking (user side)
export const createBooking = async (req, res) => {
  try {
    const { listingId, checkIn, checkOut, guests, totalPrice, utr } = req.body;
    const userId = req.user.id;

    if (!listingId || !checkIn || !checkOut || !totalPrice || !utr) {
      return res.status(400).json({ msg: "All booking fields are required." });
    }

    const newCheckIn = new Date(checkIn);
    const newCheckOut = new Date(checkOut);

    // Double check availability
    const overlapping = await Booking.find({
      listingId,
      $or: [
        {
          checkIn: { $lt: newCheckOut },
          checkOut: { $gt: newCheckIn },
        },
      ],
    });

    if (overlapping.length > 0) {
      return res.status(400).json({
        success: false,
        msg: "Listing already booked for selected dates",
      });
    }

    const newBooking = new Booking({
      userId,
      listingId,
      checkIn: newCheckIn,
      checkOut: newCheckOut,
      guests,
      totalPrice,
      utr,
      paymentStatus: "paid",
    });

    await newBooking.save();

    res.status(201).json({
      success: true,
      booking: newBooking,
    });
  } catch (err) {
    console.error("Create booking error:", err);
    res.status(500).json({ msg: "Server error while saving booking" });
  }
};

// GET /api/bookings — Get current user's bookings
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ userId }).populate("listingId").sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("Get my bookings error:", err);
    res.status(500).json({ msg: "Server error while fetching bookings" });
  }
};
