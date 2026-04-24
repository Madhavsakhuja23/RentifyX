import Listing from "../models/Listing.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinaryConfig.js";
import mongoose from "mongoose";

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

    const { title, description, category, subcategory, tagline, price, location, availableDates } =
      req.body;

    // Validate required fields
    if (!title || !description || !category || !price || !location) {
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
      price,
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