const createProperty = async (req, res) => {
  const { name, location, type, state, propertyId } = req.body;

  try {
    const newProperty = new Property({
      name,
      location,
      type,
      state,
      propertyId,
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
