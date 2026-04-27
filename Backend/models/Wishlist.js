import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  listings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing"
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Wishlist", wishlistSchema);
