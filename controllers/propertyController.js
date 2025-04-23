const Property = require("../models/Property");

const createProperty = async (req, res) => {
  const { name, location } = req.body;

  try {
    const newProperty = new Property({
      name,
      location,
      createdBy: req.user._id,
    });

    await newProperty.save();

    res
      .status(201)
      .json({ message: "Property created", property: newProperty });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create property" });
  }
};

const getProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate("createdBy", "name role");
    res.status(200).json(properties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch properties" });
  }
};

module.exports = { createProperty, getProperties };
