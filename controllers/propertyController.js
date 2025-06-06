const Property = require("../models/Property");

const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate(
      "createdBy",
      "fullName email"
    );
    return res.status(200).json(properties);
  } catch (err) {
    console.error("Error fetching properties:", err);
    return res.status(500).json({ message: "Failed to fetch properties" });
  }
};

const createProperty = async (req, res) => {
  const { type, address, lat, lng, state } = req.body;
  try {
    const generatePropertyId = async () => {
      const count = await Property.countDocuments();
      const num = (count + 1).toString().padStart(4, "0");
      return `st-${num}`;
    };

    const propertyId = await generatePropertyId();

    const newProperty = new Property({
      propertyId: propertyId,
      type: type,
      location: {
        address: address,
        coordinates: { lat: lat, lng: lng },
      },
      state: state,
      createdBy: req.user ? req.user._id : undefined,
    });

    await newProperty.save();

    return res.status(201).json({
      message: "Property created successfully",
      property: newProperty,
    });
  } catch (err) {
    console.error(`Error creating property: ${err}`);

    if (!res.headersSent) {
      return res.status(500).json({ message: "Failed to create property" });
    }
  }
};

const deleteProperty = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProperty = await Property.findByIdAndDelete(id);
    if (!deletedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    return res.status(200).json({
      message: "Property deleted successfully",
    });
  } catch (err) {
    console.error(`Error deleting property: ${err}`);
    return res.status(500).json({ message: "Failed to delete property" });
  }
};

const updatePropertyStatus = async (req, res) => {
  const { id } = req.params;
  const { state } = req.body;
  try {
    const validStates = [
      "working",
      "damaged",
      "under_repair",
      "fixed",
      "pending",
    ];
    if (!validStates.includes(state)) {
      return res.status(400).json({ message: "Invalid state value" });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      { state },
      { new: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    return res.status(200).json({
      message: "Property status updated successfully",
      property: updatedProperty,
    });
  } catch (err) {
    console.error(`Error updating property status: ${err}`);
    return res
      .status(500)
      .json({ message: "Failed to update property status" });
  }
};

const getPropertyById = async (req, res) => {
  const { id } = req.params;
  try {
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: "property not found" });
    }
    return res.status(200).json(property);
  } catch (err) {
    console.log(`Error fetching property ${err}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllProperties,
  createProperty,
  deleteProperty,
  updatePropertyStatus,
  getPropertyById,
};
