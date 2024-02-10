import express from "express";
import EngineOilDistribution from "../models/engineOilDistribution.mjs";
import EngineOilRestock from "../models/engineOilStock.mjs";

const router = express.Router();

router.post("/api/engineOilDistribution", async (req, res) => {
  const { truck_no, quantity, date, driver } = req.body;

  try {
    // Create a new document in the EngineOilDistribution collection
    const newDistributionEntry = new EngineOilDistribution({
      truck_no,
      quantity,
      date,
      driver,
    });
    await newDistributionEntry.save();

    // Subtract the quantity from the EngineOilRestock collection
    const restockEntry = await EngineOilRestock.findOne();
    if (restockEntry) {
      restockEntry.quantity -= quantity;
      await restockEntry.save();
    } else {
      throw new Error("Engine oil restock entry not found");
    }

    res
      .status(200)
      .json({ message: "Engine oil distribution recorded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
