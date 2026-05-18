import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { initSocket } from "./config/socket.js";

import authRoutes from "./routes/authRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "https://rentifyx-ff33.onrender.com", "https://rentifyx.vercel.app"]
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/wishlist", wishlistRoutes);

app.get("/", (req, res) => {
  res.send("RentifyX Backend is Running 🚀");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    const PORT = process.env.PORT || 5000;
    const server = createServer(app);

    // Initialize Socket.io
    initSocket(server);

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
  });
