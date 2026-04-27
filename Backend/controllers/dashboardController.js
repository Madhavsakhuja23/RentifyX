import Booking from "../models/Booking.js";
import Listing from "../models/Listing.js";
import Conversation from "../models/Conversation.js";
import mongoose from "mongoose";

// GET /api/dashboard/stats
export const getDashboardStats = async (req, res) => {
  try {
    const sellerId = new mongoose.Types.ObjectId(req.user.id);

    // 1. Total earnings (completed bookings)
    const earningsAggr = await Booking.aggregate([
      { $match: { sellerId, status: "completed" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalEarnings = earningsAggr.length > 0 ? earningsAggr[0].total : 0;

    // 2. Active listings
    const activeListingsCount = await Listing.countDocuments({
      seller: sellerId,
      deleted: false,
      isAvailable: true,
    });

    // 3. Ongoing bookings
    const ongoingBookingsCount = await Booking.countDocuments({
      sellerId,
      status: "ongoing",
    });

    // 4. Unread messages
    const unreadMessagesAggr = await Conversation.aggregate([
      { $match: { sellerId } },
      { $group: { _id: null, total: { $sum: "$unreadCount" } } },
    ]);
    const unreadMessagesCount = unreadMessagesAggr.length > 0 ? unreadMessagesAggr[0].total : 0;

    res.json({
      totalEarnings,
      activeListings: activeListingsCount,
      ongoingBookings: ongoingBookingsCount,
      unreadMessages: unreadMessagesCount,
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// GET /api/dashboard/revenue?range=week|month|year
export const getDashboardRevenue = async (req, res) => {
  try {
    const sellerId = new mongoose.Types.ObjectId(req.user.id);
    const { range = "month" } = req.query;

    let dateTruncUnit = "day";
    let startDateLimit = new Date();

    if (range === "week") {
      dateTruncUnit = "day";
      startDateLimit.setDate(startDateLimit.getDate() - 7);
    } else if (range === "month") {
      dateTruncUnit = "day";
      startDateLimit.setMonth(startDateLimit.getMonth() - 1);
    } else if (range === "year") {
      dateTruncUnit = "month";
      startDateLimit.setFullYear(startDateLimit.getFullYear() - 1);
    }

    const revenueData = await Booking.aggregate([
      {
        $match: {
          sellerId,
          status: "completed",
          createdAt: { $gte: startDateLimit },
        },
      },
      {
        $group: {
          _id: {
            $dateTrunc: {
              date: "$createdAt",
              unit: dateTruncUnit,
            },
          },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format for recharts
    const formattedData = revenueData.map((d) => ({
      date: d._id,
      revenue: d.revenue,
    }));

    res.json({ data: formattedData });
  } catch (err) {
    console.error("Error fetching dashboard revenue:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// GET /api/dashboard/activity
export const getDashboardActivity = async (req, res) => {
  try {
    const sellerId = req.user.id;

    // Fetch last 5 bookings
    const bookings = await Booking.find({ sellerId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("renterId", "name")
      .populate("listingId", "title");

    // Fetch last 5 conversations (enquiries)
    const conversations = await Conversation.find({ sellerId })
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate("buyerId", "name")
      .populate("listingId", "title");

    // Normalize and merge
    const activity = [];

    bookings.forEach((b) => {
      activity.push({
        id: b._id,
        type: "booking",
        text: `Booking ${b.status} by ${b.renterId?.name || "Unknown"} for "${b.listingId?.title || "Listing"}"`,
        createdAt: b.createdAt,
      });
    });

    conversations.forEach((c) => {
      activity.push({
        id: c._id,
        type: "enquiry",
        text: `New enquiry from ${c.buyerId?.name || "Unknown"} for "${c.listingId?.title || "Listing"}"`,
        createdAt: c.updatedAt,
      });
    });

    // Sort combined array
    activity.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ activity: activity.slice(0, 5) });
  } catch (err) {
    console.error("Error fetching dashboard activity:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
