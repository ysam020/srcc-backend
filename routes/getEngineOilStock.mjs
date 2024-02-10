import express from "express";
import engineOilStock from "../models/engineOilStock.mjs";

const router = express.Router();

router.get("/api/getEngineOilStock", async (req, res) => {
  const existingEngineOilStock = await engineOilStock.find({});
  if (existingEngineOilStock) {
    res.status(200).json(existingEngineOilStock);
  } else {
    res.status(200).json({ message: "No engine oil stock found" });
  }
});

export default router;
