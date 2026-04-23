import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Helper: build a safe user object to return to the client
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

// GET CURRENT USER (protected)
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(safeUser(user));
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};


// SIGNUP
export const signupUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await user.save();

    // Auto-login: return user data immediately
    res.status(201).json({
      msg: "User registered successfully",
      user: safeUser(user),
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};


// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    res.json({ user: safeUser(user) });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// GOOGLE AUTH
export const googleAuth = async (req, res) => {
  try {
    const { name, email, photo, role } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      // Update photo if provided and changed
      if (photo && user.photo !== photo) {
        user.photo = photo;
      }
      if (role && user.role !== role) {
        user.role = role;
      }
      await user.save();
    } else {
      // Hash the placeholder password for consistency
      const hashedPlaceholder = await bcrypt.hash("google-auth-placeholder", 10);

      user = await User.create({
        name,
        email,
        photo: photo || "",
        password: hashedPlaceholder,
        role: role || "user",
      });
    }

    res.json({ user: safeUser(user) });

  } catch (error) {
    console.log("Google auth error:", error);
    res.status(500).json({ msg: "Google auth failed" });
  }
};

// UPDATE PROFILE (protected)
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, location, dob } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Update fields if provided
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    if (dob !== undefined) user.dob = dob;

    await user.save();

    res.json({ user: safeUser(user) });

  } catch (err) {
    console.log("Update profile error:", err);
    res.status(500).json({ msg: "Failed to update profile" });
  }
};