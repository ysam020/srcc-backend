import express from "express";
import OrganisationMaster from "../models/master/OrganisationMaster.mjs";

const router = express.Router();

router.post("/api/addOrganisationMaster", async (req, res) => {
  try {
    const {
      name,
      gst,
      instructions,
      branches,
      phone,
      website,
      email,
      pan,
      status,
    } = req.body;

    // Check if an organisation with the same GST already exists
    const existingOrganisation = await OrganisationMaster.findOne({ gst });
    if (existingOrganisation) {
      return res
        .status(201)
        .json({ message: "An organisation with the same GST already exists." });
    }

    // Create a new organisation master document
    const newOrganisationMaster = await OrganisationMaster.create({
      name,
      gst,
      instructions,
      branches: branches,
      phone,
      website,
      email,
      pan,
      status,
    });

    res
      .status(201)
      .json({ message: "Organisation details added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
