import express from "express";
import multer from "multer";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createListing,
  getListings,
  getListingById,
  getMyListings,
  bookListing,
  updateListing,
  deleteListing,
} from "../controllers/listingController.js";

const router = express.Router();

// Use memory storage — files stay in buffer, then get piped to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// GET /api/listings/my — get all listings for the authenticated seller
router.get("/my", authMiddleware, getMyListings);

// POST /api/listings — expects exactly 5 image files under field name "images"
router.post("/", authMiddleware, upload.array("images", 5), createListing);

// ✅ GET /api/listings — Fetch all listings
router.get("/", getListings);

// ✅ GET /api/listings/:id — Fetch single listing
router.get("/:id", getListingById);

// ✅ POST /api/listings/book/:id — Book a listing
router.post("/book/:id", bookListing);
// PUT /api/listings/:id — Update listing
router.put("/:id", authMiddleware, updateListing);

// DELETE /api/listings/:id — Delete listing
router.delete("/:id", authMiddleware, deleteListing);

export default router;