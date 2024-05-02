import express from "express";
import VehicleModel from "../../models/master/vehicles.mjs";

const router = express.Router();

router.post("/api/getTruckNumberWithType/", async (req, res) => {
  const { max_tyres } = req.body;
  const data = await VehicleModel.find({ max_tyres });
  res.status(200).json(data);
});

export default router;
