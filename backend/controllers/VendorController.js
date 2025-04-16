import Vendor from "../models/Vendor.js";

export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({});
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const createVendor = async (req, res) => {
  const { name, description } = req.body;
  try {
    const vendorExists = await Vendor.findOne({ name });
    if (vendorExists) {
      return res.status(400).json({ message: "Vendor already exists" });
    }

    const vendor = new Vendor({ name, description });
    await vendor.save();
    res.status(201).json(vendor);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateVendor = async (req, res) => {
  const { name, description } = req.body;
  console.log("Update Vendor", req.body);
  try {
    let vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    vendor.name = name || vendor.name;
    vendor.description = description || vendor.description;
    
    await vendor.save();
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    await vendor.deleteOne();
    res.json({ message: "Vendor removed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
