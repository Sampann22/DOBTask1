const User = require("../models/User");

exports.getMyReferralCode = async (req, res, next) => {
  try {
    const user = await User.findById(req.user).select("referralCode");
    res.json({ referralCode: user.referralCode });
  } catch (err) {
    next(err);
  }
};

const getDownlineRecursive = async (userId, level = 1) => {
  if (level > 3) return [];

  const users = await User.find({ referredBy: userId }).select("name email");

  let result = [];

  for (let user of users) {
    const children = await getDownlineRecursive(user._id, level + 1);
    result.push({
      level,
      user,
      referrals: children
    });
  }

  return result;
};

exports.getDownline = async (req, res, next) => {
  try {
    const downline = await getDownlineRecursive(req.user);
    res.json(downline);
  } catch (err) {
    next(err);
  }
};

exports.getReferralStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user).select("earnings referrals");

    const stats = {
      totalReferrals: user.referrals.length,
      earnings: user.earnings
    };

    res.json(stats);
  } catch (err) {
    next(err);
  }
};
