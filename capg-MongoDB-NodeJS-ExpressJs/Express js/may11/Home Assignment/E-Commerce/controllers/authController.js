const User = require("../models/User");
const Otp = require("../models/Otp");
const PendingUser = require("../models/PendingUser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

exports.register = (req, res) => {
  const { name, email, password, adminSecret } = req.body;

  PendingUser.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(409).json({
          message:
            "Account already exists. An OTP was already sent to this email address.",
        });
      }

      return bcrypt.hash(password, 10).then((hashedPassword) => {
        const role = adminSecret === "admin123" ? "admin" : "user";

        return PendingUser.create({
          name,
          email,
          password: hashedPassword,
          role,
        }).then(() => {
          const otp = String(Math.floor(100000 + Math.random() * 900000));
          return Otp.create({ email, otp }).then(() =>
            sendEmail(email, otp)
              .then(() =>
                res
                  .status(201)
                  .json({ message: "OTP sent to your email address" })
              )
              .catch(() =>
                res.status(422).json({
                  message:
                    "Could not deliver OTP. Please verify the email and try again.",
                })
              )
          );
        });
      });
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Registration failed. Please try again." });
    });
};

exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  Otp.findOne({ email, otp })
    .then((otpRecord) => {
      if (!otpRecord)
        return res.status(400).json({ message: "OTP is invalid or has expired" });

      return PendingUser.findOne({ email }).then((pendingUser) => {
        if (!pendingUser) {
          return res.status(410).json({
            message: "Session expired. Please start the registration process again.",
          });
        }

        return User.findOne({ email }).then((existingUser) => {
          if (existingUser)
            return res
              .status(409)
              .json({ message: "User already exists. Please login." });

          return User.create({
            name: pendingUser.name,
            email: pendingUser.email,
            password: pendingUser.password,
            role: pendingUser.role,
            isVerified: true,
          }).then((user) =>
            Promise.all([
              PendingUser.deleteOne({ email }),
              Otp.deleteOne({ email }),
            ]).then(() =>
              res
                .status(200)
                .json({ message: "Email verified successfully", user })
            )
          );
        });
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ message: "OTP verification failed" });
    });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user)
        return res.status(401).json({ message: "Invalid credentials" });

      if (!user.isVerified) {
        return res.status(403).json({
          message: "Please verify your email before logging in.",
        });
      }

      return bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch)
          return res.status(401).json({ message: "Invalid credentials" });

        const { accessToken, refreshToken } = generateTokens(user);
        user.refreshToken = refreshToken;

        return user.save().then(() =>
          res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken,
          })
        );
      });
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Login failed. Please try again later." });
    });
};

exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token provided" });

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    return res
      .status(403)
      .json({ message: "Refresh token is invalid or has expired" });
  }

  User.findById(decoded.id)
    .then((user) => {
      if (!user || user.refreshToken !== refreshToken) {
        return res
          .status(403)
          .json({ message: "Token mismatch or user not found" });
      }

      const { accessToken, refreshToken: newRefreshToken } =
        generateTokens(user);
      user.refreshToken = newRefreshToken;

      return user.save().then(() =>
        res.status(200).json({
          message: "Token refreshed successfully",
          accessToken,
          refreshToken: newRefreshToken,
        })
      );
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ message: "Token refresh failed" });
    });
};
