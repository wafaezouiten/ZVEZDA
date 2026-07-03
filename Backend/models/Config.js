const mongoose = require("mongoose");

const configSchema = new mongoose.Schema({
  freeShippingThreshold: {
    type: Number,
    default: 800, // default value
  },
}, { timestamps: true });

const Config = mongoose.model("Config", configSchema);

module.exports = Config;
