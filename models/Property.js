const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  propertyId: { type: String, unique: true },
  type: { type: String, enum: ["streetlight", "road", "pipe", "bridge"] },
  location: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  state: {
    type: String,
    enum: ["working", "damaged", "under_repair", "fixed", "pending"],
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Property", propertySchema);
