const express = require("express");
const { protect, admin } = require("../middleware/authmiddleware");
const {
  getFreeShippingThreshold,
  updateFreeShippingThreshold,
} = require("../controllers/configController");

const router = express.Router();

router.get("/free-shipping", protect, admin, getFreeShippingThreshold);
router.put("/free-shipping", protect, admin, updateFreeShippingThreshold);

module.exports = router;
