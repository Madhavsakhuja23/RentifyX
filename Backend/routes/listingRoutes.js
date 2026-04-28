import express from "express";
import multer from "multer";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createListing,
  getListings,
  getListingById,
  getMyListings,
  toggleListingAvailability,
  updateListing,
  deleteListing,
} from "../controllers/listingController.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
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

// POST /api/listings — create listing with exactly 5 images
router.post("/", authMiddleware, upload.array("images", 5), createListing);

// GET /api/listings — Fetch all listings
router.get("/", getListings);

// GET /api/listings/:id — Fetch single listing
router.get("/:id", getListingById);

// PATCH /api/listings/:id/availability — Toggle availability (seller dashboard)
router.patch("/:id/availability", authMiddleware, toggleListingAvailability);

// PUT /api/listings/:id — Update listing fields
router.put("/:id", authMiddleware, updateListing);

// DELETE /api/listings/:id — Soft delete
router.delete("/:id", authMiddleware, deleteListing);

export default router;