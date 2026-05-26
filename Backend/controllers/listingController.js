import Listing from "../models/Listing.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinaryConfig.js";
import mongoose from "mongoose";
import { getIo } from "../config/socket.js";

// GET /api/listings/my — Get all listings for the authenticated seller
export const getMyListings = async (req, res) => {
  try {
    const sellerId = new mongoose.Types.ObjectId(req.user.id);

    const listings = await Listing.aggregate([
      { $match: { seller: sellerId, deleted: { $ne: true } } },
      {
        $lookup: {
          from: "bookings",
          let: { listingId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$listingId", "$$listingId"] },
                    { $in: ["$status", ["confirmed", "active", "ongoing", "paid"]] },
                  ],
                },
              },
            },
            {
              $addFields: {
                renterId: { $ifNull: ["$renterId", "$userId"] },
                endDate: { $ifNull: ["$endDate", "$checkOut"] },
                startDate: { $ifNull: ["$startDate", "$checkIn"] },
              }
            },
            {
              $lookup: {
                from: "users",
                localField: "renterId",
                foreignField: "_id",
                as: "renter",
              },
            },
            { $unwind: { path: "$renter", preserveNullAndEmptyArrays: true } },
          ],
          as: "ongoingBookings",
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.json({ listings });
  } catch (err) {
    console.error("Get my listings error:", err);
    res.status(500).json({ msg: "Server error while fetching listings" });
  }
};

// POST /api/listings — Create a new listing with exactly 5 images
export const createListing = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length !== 5) {
      return res.status(400).json({
        msg: `Exactly 5 images are required. You uploaded ${files ? files.length : 0}.`,
      });
    }

    const { title, description, category, subcategory, tagline, price, timespan, location, availableDates } =
      req.body;

    if (!title || !description || !category || !subcategory || !price || !timespan || !location) {
      return res.status(400).json({ msg: "All required fields must be filled." });
    }

    const listingId = new mongoose.Types.ObjectId();
    const sellerId = req.user.id;

    const sellerUser = await User.findById(sellerId).select("name");
    if (!sellerUser) {
      return res.status(404).json({ msg: "Seller not found" });
    }

    const sellerName = sellerUser.name.replace(/\s+/g, "_").toLowerCase();
    const folderPath = `seller/${sellerName}/${listingId}`;

    const uploadPromises = files.map((file, index) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folderPath,
            public_id: `image_${index + 1}`,
            resource_type: "image",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          }
        );
        uploadStream.end(file.buffer);
      });
    });

    const images = await Promise.all(uploadPromises);

    const listing = new Listing({
      _id: listingId,
      seller: sellerId,
      sellerName: sellerUser.name,
      title,
      description,
      category,
      subcategory: subcategory || "",
      tagline: tagline || "",
      price: Number(price),
      timespan,
      location,
      availableDates: availableDates || "",
      images,
    });

    await listing.save();

    try {
      getIo().to(sellerId.toString()).emit("dashboard_stats_updated");
    } catch (socketErr) {
      console.error("Socket emit failed on listing create:", socketErr);
    }

    res.status(201).json({
      msg: "Listing created successfully",
      listing,
    });
  } catch (err) {
    console.error("Create listing error:", err);
    res.status(500).json({ msg: "Server error while creating listing" });
  }
};

// GET /api/listings — Fetch all listings (with optional filters)
export const getListings = async (req, res) => {
  try {
    const { location, category } = req.query;

    let query = { deleted: { $ne: true } };

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    const listings = await Listing.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: listings.length,
      listings,
    });
  } catch (error) {
    console.error("Fetch listings error:", error);
    res.status(500).json({ msg: "Server error while fetching listings" });
  }
};

// GET /api/listings/:id — Fetch a single listing by ID
export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ msg: "Listing not found" });
    }

    res.status(200).json({ success: true, listing });
  } catch (error) {
    console.error("Fetch listing by ID error:", error);
    res.status(500).json({ msg: "Server error while fetching listing" });
  }
};

// PATCH /api/listings/:id/availability — Toggle availability (seller dashboard)
export const toggleListingAvailability = async (req, res) => {
  try {
    const listingId = req.params.id;
    const sellerId = req.user.id;

    const listing = await Listing.findOne({ _id: listingId, seller: sellerId });
    if (!listing) {
      return res.status(404).json({ msg: "Listing not found or unauthorized" });
    }

    listing.isAvailable = !listing.isAvailable;
    await listing.save();

    res.json({ listing });
  } catch (err) {
    console.error("Error toggling availability:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// PUT /api/listings/:id — Update a listing
export const updateListing = async (req, res) => {
  try {
    const listingId = req.params.id;
    const sellerId = req.user.id;

    let listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({ msg: "Listing not found" });
    }

    if (listing.seller.toString() !== sellerId) {
      return res.status(403).json({ msg: "Not authorized to update this listing" });
    }

    const { title, description, price, location, availableDates, available, isAvailable } = req.body;

    if (title) listing.title = title;
    if (description) listing.description = description;
    if (price) listing.price = price;
    if (location) listing.location = location;
    if (availableDates !== undefined) listing.availableDates = availableDates;
    if (available !== undefined) listing.isAvailable = available;
    if (isAvailable !== undefined) listing.isAvailable = isAvailable;

    await listing.save();

    try {
      getIo().to(sellerId.toString()).emit("dashboard_stats_updated");
    } catch (socketErr) {
      console.error("Socket emit failed on listing update:", socketErr);
    }

    res.status(200).json({ msg: "Listing updated successfully", listing });
  } catch (error) {
    console.error("Update listing error:", error);
    res.status(500).json({ msg: "Server error while updating listing" });
  }
};

// DELETE /api/listings/:id — Soft delete a listing
export const deleteListing = async (req, res) => {
  try {
    const listingId = req.params.id;
    const sellerId = req.user.id;

    const listing = await Listing.findOne({ _id: listingId, seller: sellerId });
    if (!listing) {
      return res.status(404).json({ msg: "Listing not found or unauthorized" });
    }

    // Also clean up Cloudinary images on delete
    if (listing.images && listing.images.length > 0) {
      for (const image of listing.images) {
        if (image.publicId) {
          await cloudinary.uploader.destroy(image.publicId);
        }
      }
    }

    listing.deleted = true;
    await listing.save();

    try {
      getIo().to(sellerId.toString()).emit("dashboard_stats_updated");
    } catch (socketErr) {
      console.error("Socket emit failed on listing delete:", socketErr);
    }

    res.json({ msg: "Listing deleted successfully", id: listingId });
  } catch (err) {
    console.error("Error deleting listing:", err);
    res.status(500).json({ msg: "Server error" });
  }
};