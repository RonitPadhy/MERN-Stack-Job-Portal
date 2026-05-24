import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }

    req.id = decoded.userId;
    next();
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server error" });
  }
};

export default verifyToken;
