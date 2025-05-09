const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    propertyId: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    location: {
      address: { type: String },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    state: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
