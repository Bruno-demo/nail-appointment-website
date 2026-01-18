const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");


// ==========================================
// REGISTER WITH EMAIL VERIFICATION

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Token expires in 15 minutes
    const verificationTokenExpires = Date.now() + 15 * 60 * 1000;

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires,
      isVerified: false
    });

    const verifyLink = `${process.env.BASE_URL}/api/auth/verify/${verificationToken}`;

    await sendEmail(
      email,
      "Verify Your Account - Yves Nail Salon",
      `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Verify your email</title>
  </head>
  <body style="margin:0; padding:0; background:#f7f7fb; font-family: Arial, sans-serif; color:#111827;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
      Verify your email to finish setting up your Yves Nail Salon account.
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7fb; padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #eee;">
            <tr>
              <td style="padding:22px 24px; background:#fff7fb; border-bottom:1px solid #f1e7f0;">
                <div style="font-size:18px; font-weight:700; color:#111827;">Yves Nail Salon</div>
                <div style="font-size:12px; color:#9ca3af; margin-top:4px;">Account verification</div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <h1 style="margin:0 0 10px; font-size:24px; color:#111827;">Confirm your email</h1>
                <p style="margin:0 0 12px; color:#374151;">Hi ${name},</p>
                <p style="margin:0 0 16px; color:#374151;">Thanks for creating an account at Yves Nail Salon. Please verify your email address to activate your account.</p>
                <div style="margin:20px 0 18px;">
                  <a href="${verifyLink}" style="display:inline-block; padding:12px 22px; background:#ff5fa2; color:#ffffff; text-decoration:none; border-radius:999px; font-weight:600;">Verify email</a>
                </div>
                <p style="margin:0 0 10px; font-size:13px; color:#6b7280;">This link expires in 15 minutes.</p>
                <p style="margin:0 0 10px; font-size:13px; color:#6b7280;">If the button does not work, copy and paste this link into your browser:</p>
                <p style="margin:0 0 18px; word-break:break-all;">
                  <a href="${verifyLink}" style="color:#ff5fa2; text-decoration:none;">${verifyLink}</a>
                </p>
                <p style="margin:0; font-size:12px; color:#9ca3af;">If you did not create this account, no action is required.</p>
              </td>
            </tr>
          </table>
          <div style="max-width:600px; margin:10px auto 0; font-size:12px; color:#9ca3af; text-align:center;">
            (c) ${new Date().getFullYear()} Yves Nail Salon. All rights reserved.
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>
      `
    );

    res.status(201).json({
      message: "Registration successful. Check your email to verify your account."
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==========================================
// VERIFY EMAIL
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token
    });

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=expired`);
    }
    // If token expired
        if (user.verificationTokenExpires < Date.now()) {
      user.verificationToken = undefined;
      user.verificationTokenExpires = undefined;
      await user.save();

      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=expired&email=${user.email}`
      );
    }


    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();

    res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==========================================
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Account already verified" });
    }

    // Create new token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = Date.now() + 15 * 60 * 1000;

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

    const verifyLink = `${process.env.BASE_URL}/api/auth/verify/${verificationToken}`;

    await sendEmail(
      user.email,
      "Verify Your Account - Yves Nail Salon",
      `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Verify your email</title>
  </head>
  <body style="margin:0; padding:0; background:#f7f7fb; font-family: Arial, sans-serif; color:#111827;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
      Your verification link expired. Use the new link to verify your account.
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7fb; padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #eee;">
            <tr>
              <td style="padding:22px 24px; background:#fff7fb; border-bottom:1px solid #f1e7f0;">
                <div style="font-size:18px; font-weight:700; color:#111827;">Yves Nail Salon</div>
                <div style="font-size:12px; color:#9ca3af; margin-top:4px;">Verification link refreshed</div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <h1 style="margin:0 0 10px; font-size:24px; color:#111827;">Verify your email</h1>
                <p style="margin:0 0 12px; color:#374151;">Hi ${user.name},</p>
                <p style="margin:0 0 16px; color:#374151;">Your previous verification link expired. Please use the new link below to verify your account.</p>
                <div style="margin:20px 0 18px;">
                  <a href="${verifyLink}" style="display:inline-block; padding:12px 22px; background:#ff5fa2; color:#ffffff; text-decoration:none; border-radius:999px; font-weight:600;">Verify email</a>
                </div>
                <p style="margin:0 0 10px; font-size:13px; color:#6b7280;">This link expires in 15 minutes.</p>
                <p style="margin:0 0 10px; font-size:13px; color:#6b7280;">If the button does not work, copy and paste this link into your browser:</p>
                <p style="margin:0 0 18px; word-break:break-all;">
                  <a href="${verifyLink}" style="color:#ff5fa2; text-decoration:none;">${verifyLink}</a>
                </p>
                <p style="margin:0; font-size:12px; color:#9ca3af;">If you did not request this email, you can ignore it.</p>
              </td>
            </tr>
          </table>
          <div style="max-width:600px; margin:10px auto 0; font-size:12px; color:#9ca3af; text-align:center;">
            (c) ${new Date().getFullYear()} Yves Nail Salon. All rights reserved.
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>
      `
    );

    res.json({ message: "New verification email sent successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// LOGIN (ONLY IF VERIFIED)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Check if fields are filled
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify your email first" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * @desc   Update user profile
 * @route  PUT /api/users/me
 * @access Private
 */
exports.updateProfile = async (req, res) => {
  try {
    // ✅ Correct auth check
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, email, phone } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
