import User from "../models/User.js";

// Simple auth middleware — reads userId from Authorization header
// Frontend sends: Authorization: <userId>
const authMiddleware = async (req, res, next) => {
  try {
    const userId = req.headers.authorization;

    if (!userId) {
      return res.status(401).json({ msg: "No auth, access denied" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    req.user = { id: user._id.toString(), name: user.name, role: user.role };
    next();

  } catch (err) {
    return res.status(401).json({ msg: "Invalid auth" });
  }
};

export default authMiddleware;