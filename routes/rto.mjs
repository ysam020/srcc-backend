import express from "express";
import RTO from "../models/rtoModel.mjs";

const router = express.Router();

router.post("/api/rto", async (req, res) => {
  try {
    const data = req.body;
    const newRTO = await RTO.create(data);

    res.status(201).json({ message: "RTO details added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
