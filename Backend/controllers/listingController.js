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
      subcategory,
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
