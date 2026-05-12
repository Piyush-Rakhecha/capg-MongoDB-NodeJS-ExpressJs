const nodemailer = require("nodemailer");

const sendEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  return await transporter.sendMail({
    from: `ShopZone <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Email Verification Code",
    text: `Use this OTP to verify your account: ${otp}`,
  });
};

module.exports = sendEmail;
