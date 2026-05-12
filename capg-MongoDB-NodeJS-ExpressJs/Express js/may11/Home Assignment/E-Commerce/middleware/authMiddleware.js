const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authorization token is missing",
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Token has expired. Please refresh your token.",
        });
      }

      return res.status(401).json({
        message: "Invalid token",
      });
    }

    User.findById(decoded.id)
      .select("-password -refreshToken")
      .then((user) => {
        if (!user) {
          return res.status(401).json({
            message: "User not found",
          });
        }

        req.user = user;

        next();
      })
      .catch(() => {
        res.status(500).json({
          message: "Authentication failed",
        });
      });
  });
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action",
      });
    }

    next();
  };
};
