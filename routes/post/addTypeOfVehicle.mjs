import express from "express";
import TypeOfVehicle from "../../models/master/typeOfVehicle.mjs";

const router = express.Router();

router.post("/api/addTypeOfVehicle", async (req, res) => {
  try {
    const data = req.body;
    const newTypeOfVehicle = await TypeOfVehicle.create(data);

    res.status(201).json({ message: "Type of vehicle added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
