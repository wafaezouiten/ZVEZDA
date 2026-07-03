const Config = require("../models/Config");

// Get current free shipping threshold
const getFreeShippingThreshold = async (req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) {
      // Create default if none exists
      config = new Config();
      await config.save();
    }
    res.json({ freeShippingThreshold: config.freeShippingThreshold });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update free shipping threshold
const updateFreeShippingThreshold = async (req, res) => {
  try {
    const { freeShippingThreshold } = req.body;
    if (freeShippingThreshold == null) {
      return res.status(400).json({ message: "Threshold is required" });
    }

    let config = await Config.findOne();
    if (!config) {
      config = new Config({ freeShippingThreshold });
    } else {
      config.freeShippingThreshold = freeShippingThreshold;
    }
    await config.save();
    res.json({ freeShippingThreshold: config.freeShippingThreshold });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getFreeShippingThreshold,
  updateFreeShippingThreshold,
};
