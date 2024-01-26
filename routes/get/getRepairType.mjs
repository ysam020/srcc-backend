import express from "express";
import RepairTypeModel from "../../models/master/repairTypes.mjs";

const router = express.Router();

router.get("/api/getRepairType", async (req, res) => {
  const existingRepairType = await RepairTypeModel.find({});
  if (existingRepairType) {
    res.status(200).json(existingRepairType);
  } else {
    res.status(200).json({ message: "No repair type found" });
  }
});

export default router;
