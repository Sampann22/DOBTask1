const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    referralCode: {
      type: String,
      unique: true
    },

    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    referrals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    earnings: {
      level1: { type: Number, default: 0 },
      level2: { type: Number, default: 0 },
      level3: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
