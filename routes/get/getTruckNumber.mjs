import express from "express";
import VehicleModel from "../../models/master/vehicles.mjs";

const router = express.Router();

router.get("/api/getTruckNumber", async (req, res) => {
  try {
    const existingVehicles = await VehicleModel.find({}).select("truck_no");
    const truckNumbers = existingVehicles.map((vehicle) => vehicle.truck_no);

    if (truckNumbers.length > 0) {
      res.status(200).json(truckNumbers);
    } else {
      res.status(200).json({ message: "No vehicle found" });
    }
  } catch (error) {
    // Handle any errors, e.g., database connection issues
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
