const Property = require("../models/Property");

const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate(
      "createdBy",
      "fullName email"
    );
    res.status(200).json(properties);
  } catch (err) {
    console.error("Error fetching properties:", err);
    res.status(500).json({ message: "Failed to fetch properties" });
  }
};

const createProperty = async (req, res) => {
  try {
    const { propertyId, type, location, state } = req.body;

    const newProperty = new Property({
      propertyId,
      type,
      location,
      state,
    });

    await newProperty.save();

    res
      .status(201)
      .json({ message: "Property created", property: newProperty });
  } catch (err) {
    console.error("Error creating property:", err);
    res.status(500).json({ message: "Failed to create property" });
  }
};

module.exports = {
  getAllProperties,
  createProperty,
};
