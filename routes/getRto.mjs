import express from "express";
import RTO from "../models/rtoModel.mjs";

const router = express.Router();

router.get("/api/getRto", async (req, res) => {
  const existingRTO = await RTO.find({});
  if (existingRTO) {
    res.status(200).json(existingRTO);
  } else {
    res.status(200).json({ message: "No RTO details found" });
  }
});

export default router;
