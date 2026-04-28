import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Helper: build safe user object
const safeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  photo: user.photo || "",
  phone: user.phone || "",
  location: user.location || "",
  dob: user.dob || "",
});

// Helper: generate token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ===============================
// GET CURRENT USER
// ===============================
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        msg: "User not found"
      });
    }

    res.json({
      user: safeUser(user)
    });

  } catch (error) {
    console.log("GET ME ERROR:", error);

    res.status(500).json({
      msg: "Server error"
    });
  }
};

// ===============================
// SIGNUP
// ===============================
export const signupUser = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    email = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        msg: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user"
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: safeUser(user)
    });

  } catch (error) {
    console.log("SIGNUP ERROR:", error);

    res.status(500).json({
      msg: "Server error"
    });
  }
};

// ===============================
// LOGIN
// ===============================
export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        msg: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        msg: "Invalid credentials"
      });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: safeUser(user)
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error);

    res.status(500).json({
      msg: "Server error"
    });
  }
};

// ===============================
// GOOGLE AUTH
// ===============================
export const googleAuth = async (req, res) => {
  try {
    let { name, email, photo, role } = req.body;

    email = email.toLowerCase().trim();

    let user = await User.findOne({ email });

    if (user) {
      // Existing user login

      if (photo) {
        user.photo = photo;
      }

      if (
        role &&
        ["user", "owner", "both"].includes(role)
      ) {
        if (role === "both") {
          user.role = "both";
        } else if (role === "owner" && user.role === "user") {
          user.role = "owner";
        }
        // If role is 'user' but they are already 'owner' or 'both', do nothing
      }

      await user.save();

    } else {
      // New Google user

      const hashedPassword = await bcrypt.hash(
        "google-temp-password",
        10
      );

      user = await User.create({
        name,
        email,
        photo: photo || "",
        password: hashedPassword,
        role: role || "user"
      });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: safeUser(user)
    });

  } catch (error) {
    console.log("GOOGLE AUTH ERROR:", error);

    res.status(500).json({
      msg: "Google auth failed"
    });
  }
};

// ===============================
// UPDATE PROFILE
// ===============================
export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      location,
      dob
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        msg: "User not found"
      });
    }

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    if (dob !== undefined) user.dob = dob;

    if (email !== undefined) {
      user.email = email.toLowerCase().trim();
    }

    await user.save();

    res.json({
      user: safeUser(user)
    });

  } catch (error) {
    console.log("UPDATE PROFILE ERROR:", error);

    res.status(500).json({
      msg: "Failed to update profile"
    });
  }
};