const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    propertyId: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    location: {
      address: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
    state: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
