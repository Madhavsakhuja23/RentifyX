import Booking from "../models/Booking.js";

// POST /api/bookings/check-availability
export const checkAvailability = async (req, res) => {
  try {
    const { listingId, checkIn, checkOut } = req.body;

    if (!listingId || !checkIn || !checkOut) {
      return res.status(400).json({ msg: "Please provide listingId, checkIn and checkOut dates." });
    }

    const newCheckIn = new Date(checkIn);
    const newCheckOut = new Date(checkOut);

    // Find overlapping bookings
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
        conflictingDates: overlapping.map(b => ({ checkIn: b.checkIn, checkOut: b.checkOut })),
      });
    }

    res.json({ available: true });
  } catch (err) {
    console.error("Check availability error:", err);
    res.status(500).json({ msg: "Server error during availability check" });
  }
};

// POST /api/bookings
export const createBooking = async (req, res) => {
  try {
    const { listingId, checkIn, checkOut, guests, totalPrice, utr } = req.body;
    const userId = req.user.id;

    if (!listingId || !checkIn || !checkOut || !totalPrice || !utr) {
      return res.status(400).json({ msg: "All booking fields are required." });
    }

    const newCheckIn = new Date(checkIn);
    const newCheckOut = new Date(checkOut);

    // Double check availability (Prevention of double booking)
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
