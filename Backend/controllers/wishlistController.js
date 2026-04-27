import Wishlist from "../models/Wishlist.js";

// Add listing to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { listingId } = req.body;

    if (!listingId) {
      return res.status(400).json({ msg: "Listing ID is required" });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, listings: [listingId] });
    } else {
      // Avoid duplicates
      if (!wishlist.listings.includes(listingId)) {
        wishlist.listings.push(listingId);
      }
    }

    await wishlist.save();
    res.status(200).json({ msg: "Added to wishlist", wishlist });
  } catch (err) {
    console.error("Error adding to wishlist:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Remove listing from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { listingId } = req.body;

    if (!listingId) {
      return res.status(400).json({ msg: "Listing ID is required" });
    }

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ msg: "Wishlist not found" });
    }

    wishlist.listings = wishlist.listings.filter(
      (id) => id.toString() !== listingId
    );

    await wishlist.save();
    res.status(200).json({ msg: "Removed from wishlist", wishlist });
  } catch (err) {
    console.error("Error removing from wishlist:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find wishlist and populate listings
    const wishlist = await Wishlist.findOne({ userId }).populate("listings");

    if (!wishlist) {
      return res.status(200).json({ listings: [] });
    }

    res.status(200).json(wishlist);
  } catch (err) {
    console.error("Error fetching wishlist:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
