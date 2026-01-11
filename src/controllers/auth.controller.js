const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const shortid = require("shortid");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, referralCode } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user instance
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      referralCode: shortid.generate()
    });

    let level1Referrer = null;
    let level2Referrer = null;
    let level3Referrer = null;

    // If referral code provided
    if (referralCode) {
      level1Referrer = await User.findOne({ referralCode });

      if (!level1Referrer) {
        return res.status(400).json({ message: "Invalid referral code" });
      }

      newUser.referredBy = level1Referrer._id;

      // Level 2 & 3 traversal
      level2Referrer = level1Referrer.referredBy
        ? await User.findById(level1Referrer.referredBy)
        : null;

      level3Referrer = level2Referrer?.referredBy
        ? await User.findById(level2Referrer.referredBy)
        : null;
    }

    // Save new user
    await newUser.save();

    // Link referrals & rewards
    if (level1Referrer) {
      level1Referrer.referrals.push(newUser._id);
      level1Referrer.earnings.level1 += 100;
      await level1Referrer.save();
    }

    if (level2Referrer) {
      level2Referrer.earnings.level2 += 50;
      await level2Referrer.save();
    }

    if (level3Referrer) {
      level3Referrer.earnings.level3 += 25;
      await level3Referrer.save();
    }

    return res.status(201).json({
      message: "User registered successfully",
      referralCode: newUser.referralCode
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    next(err);
  }
};
