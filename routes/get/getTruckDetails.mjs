import express from "express";
import Truck from "../../models/truckModel.mjs";

const router = express.Router();

router.get("/api/getTruckDetails/:truck_no", async (req, res) => {
  const { truck_no } = req.params;

  try {
    const existingTruckDetails = await Truck.findOne({
      truck_no,
    });

    if (existingTruckDetails) {
      res.status(200).json(existingTruckDetails);
    } else {
      res.status(404).json({ message: "Truck details not found" });
    }
  } catch (error) {
    console.error("Error retrieving truck details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
