const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const referralController = require("../controllers/referral.controller");

router.get("/my-code", auth, referralController.getMyReferralCode);
router.get("/downline", auth, referralController.getDownline);
router.get("/stats", auth, referralController.getReferralStats);

module.exports = router;
