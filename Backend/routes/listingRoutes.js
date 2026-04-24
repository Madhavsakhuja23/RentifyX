import express from "express";
import multer from "multer";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createListing,
  getListings,
  getListingById,
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


// ✅ GET /api/listings — Fetch all listings
router.get("/", getListings);

// ✅ GET /api/listings/:id — Fetch single listing
router.get("/:id", getListingById);


// ✅ POST /api/listings — Create listing
router.post(
  "/",
  authMiddleware,
  upload.array("images", 5),
  createListing
);

export default router;