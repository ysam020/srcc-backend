import express from "express";
import EngineOilRestock from "../models/engineOilStock.mjs";
const router = express.Router();

router.post("/api/restockEngineOil", async (req, res) => {
  const { quantity } = req.body;

  try {
    // Check if there is already a document in the database
    let engineOilRestock = await EngineOilRestock.findOne();

    if (!engineOilRestock) {
      // If no document found, create a new one with the quantity sent in req.body
      const newEngineOilRestock = new EngineOilRestock({
        quantity: parseInt(quantity) ? parseInt(quantity) : 0, // Parse and set quantity to 0 if not provided
      });
      await newEngineOilRestock.save();
    } else {
      // If there is an existing document, update its quantity based on the condition
      if (quantity !== undefined && quantity !== "") {
        engineOilRestock.quantity += parseInt(quantity);
      }
      await engineOilRestock.save();
    }

    res
      .status(200)
      .json({ message: "Engine oil restock updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
