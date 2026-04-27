import Listing from "../models/Listing.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinaryConfig.js";
import mongoose from "mongoose";

// POST /api/listings — Create a new listing with exactly 5 images
// GET /api/listings/my — Get all listings for the authenticated seller
export const getMyListings = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const listings = await Listing.find({ seller: sellerId }).sort({ createdAt: -1 });
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

    // Validate exactly 5 images
    if (!files || files.length !== 5) {
      return res.status(400).json({
        msg: `Exactly 5 images are required. You uploaded ${files ? files.length : 0}.`,
      });
    }

    const { title, description, category, subcategory, tagline, price, timespan, location, availableDates } =
      req.body;

    // Validate required fields
    if (!title || !description || !category || !subcategory || !price || !timespan || !location) {
      return res.status(400).json({ msg: "All required fields must be filled." });
    }

    // Generate a listing ID upfront so we can use it in the Cloudinary folder path
    const listingId = new mongoose.Types.ObjectId();
    const sellerId = req.user.id;

    // Fetch seller name from DB
    const sellerUser = await User.findById(sellerId).select("name");
    if (!sellerUser) {
      return res.status(404).json({ msg: "Seller not found" });
    }

    // Sanitize seller name for folder path (replace spaces with underscores, lowercase)
    const sellerName = sellerUser.name.replace(/\s+/g, "_").toLowerCase();
    const folderPath = `seller/${sellerName}/${listingId}`;

    // Upload each image to Cloudinary under the listing-specific folder
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

    // Create the listing document in MongoDB
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

    res.status(201).json({
      msg: "Listing created successfully",
      listing,
    });
  } catch (err) {
    console.error("Create listing error:", err);
    res.status(500).json({ msg: "Server error while creating listing" });
  }
};

// GET /api/listings — Fetch all listings
export const getListings = async (req, res) => {
  try {
    const { location, category } = req.query;

    let query = {};

    // Optional filters
    if (location) {
      query.location = {
        $regex: location,
        $options: "i",
      };
    }

    if (category) {
      query.category = category;
    }

    const listings = await Listing.find(query)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: listings.length,
      listings,
    });

  } catch (error) {
    console.error("Fetch listings error:", error);

    res.status(500).json({
      msg: "Server error while fetching listings",
    });
  }
};

// GET /api/listings/:id — Fetch a single listing by ID
export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ msg: "Listing not found" });
    }

    res.status(200).json({
      success: true,
      listing,
    });
  } catch (error) {
    console.error("Fetch listing by ID error:", error);

    res.status(500).json({
      msg: "Server error while fetching listing",
    });
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

    const { title, description, price, location, availableDates, available } = req.body;

    if (title) listing.title = title;
    if (description) listing.description = description;
    if (price) listing.price = price;
    if (location) listing.location = location;
    if (availableDates !== undefined) listing.availableDates = availableDates;
    if (available !== undefined) listing.available = available;

    await listing.save();

    res.status(200).json({ msg: "Listing updated successfully", listing });
  } catch (error) {
    console.error("Update listing error:", error);
    res.status(500).json({ msg: "Server error while updating listing" });
  }
};

// DELETE /api/listings/:id — Delete a listing
export const deleteListing = async (req, res) => {
  try {
    const listingId = req.params.id;
    const sellerId = req.user.id;

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({ msg: "Listing not found" });
    }

    if (listing.seller.toString() !== sellerId) {
      return res.status(403).json({ msg: "Not authorized to delete this listing" });
    }

    // Delete images from Cloudinary
    if (listing.images && listing.images.length > 0) {
      for (const image of listing.images) {
        if (image.publicId) {
          await cloudinary.uploader.destroy(image.publicId);
        }
      }
    }
    
    await Listing.findByIdAndDelete(listingId);

    res.status(200).json({ msg: "Listing deleted successfully" });
  } catch (error) {
    console.error("Delete listing error:", error);
    res.status(500).json({ msg: "Server error while deleting listing" });
  }
};