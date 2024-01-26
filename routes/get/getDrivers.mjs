import express from "express";
import DriverModel from "../../models/master/driverDetails.mjs";

const router = express.Router();

router.get("/api/getDrivers", async (req, res) => {
  const drivers = await DriverModel.find({});

  if (drivers) {
    res.status(200).json(drivers);
  } else {
    res.status(200).json({ message: "No driver found" });
  }
});

export default router;
