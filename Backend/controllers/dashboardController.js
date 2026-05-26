import Booking from "../models/Booking.js";
import Listing from "../models/Listing.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import mongoose from "mongoose";

// GET /api/dashboard/stats
export const getDashboardStats = async (req, res) => {
  try {
    const sellerId = new mongoose.Types.ObjectId(req.user.id);

    // Fetch listing IDs owned by the seller to aggregate older/buyer-created bookings
    const sellerListings = await Listing.find({ seller: sellerId }).select("_id");
    const listingIds = sellerListings.map((l) => l._id);

    // 1. Total earnings (completed or successfully paid bookings)
    const earningsAggr = await Booking.aggregate([
      {
        $match: {
          $or: [
            { sellerId, $or: [{ status: "completed" }, { paymentStatus: "paid" }] },
            { listingId: { $in: listingIds }, $or: [{ status: "completed" }, { paymentStatus: "paid" }] },
          ],
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $ifNull: ["$totalAmount", "$totalPrice"] } },
        },
      },
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
      $or: [
        { sellerId, status: { $in: ["confirmed", "active", "ongoing", "paid"] } },
        { listingId: { $in: listingIds }, status: { $in: ["confirmed", "active", "ongoing", "paid"] } },
      ],
    });

    // 4. Unread messages (user-specific unread count from Message collection)
    const unreadMessagesCount = await Message.countDocuments({
      receiverId: sellerId,
      read: false,
    });

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

    // Fetch listing IDs owned by the seller to aggregate older/buyer-created bookings
    const sellerListings = await Listing.find({ seller: sellerId }).select("_id");
    const listingIds = sellerListings.map((l) => l._id);

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
          $or: [
            { sellerId, $or: [{ status: { $in: ["confirmed", "completed"] } }, { paymentStatus: "paid" }] },
            { listingId: { $in: listingIds }, $or: [{ status: { $in: ["confirmed", "completed"] } }, { paymentStatus: "paid" }] },
          ],
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
          revenue: { $sum: { $ifNull: ["$totalAmount", "$totalPrice"] } },
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

    // Fetch listing IDs owned by the seller to aggregate older/buyer-created bookings
    const sellerListings = await Listing.find({ seller: sellerId }).select("_id");
    const listingIds = sellerListings.map((l) => l._id);

    // Fetch last 5 bookings matching sellerId or listingId
    const bookings = await Booking.find({
      $or: [
        { sellerId },
        { listingId: { $in: listingIds } }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("renterId", "name")
      .populate("userId", "name")
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
      const renterName = b.renterId?.name || b.userId?.name || "Unknown";
      activity.push({
        id: b._id,
        type: "booking",
        text: `New booking confirmed by ${renterName} for "${b.listingId?.title || "Listing"}"`,
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
