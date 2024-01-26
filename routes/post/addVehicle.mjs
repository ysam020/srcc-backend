import express from "express";
import Vehicles from "../../models/master/vehicles.mjs";

const router = express.Router();

router.post("/api/addVehicle", async (req, res) => {
  const { truck_no, max_tyres, units } = req.body;
  console.log(req.body);
  try {
    const existingVehicle = await Vehicles.findOne({ truck_no });
    if (existingVehicle) {
      res.status(200).json({ message: "Vehicle already exists" });
    } else {
      const newVehicle = new Vehicles({
        truck_no,
        max_tyres,
        units,
        _date: new Date().toLocaleDateString("en-GB"),
      });
      await newVehicle.save();
      res.status(200).json({ message: "Vehicle added successfully" });
    }
  } catch (err) {
    console.log(err);
  }
});

export default router;
