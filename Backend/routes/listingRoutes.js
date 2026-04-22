import express from "express";
import multer from "multer";
import authMiddleware from "../middleware/authMiddleware.js";
import { createListing } from "../controllers/listingController.js";

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

// POST /api/listings — expects exactly 5 image files under field name "images"
router.post("/", authMiddleware, upload.array("images", 5), createListing);

export default router;
