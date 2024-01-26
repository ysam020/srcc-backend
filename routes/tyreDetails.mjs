import express from "express";
import Tyre from "../models/tyreModel.mjs";

const router = express.Router();

router.get("/tyreDetails/:tyreNo", async (req, res) => {
  const { tyreNo } = req.params;
  const existingTyre = await Tyre.findOne({ tyre_no: tyreNo });

  if (existingTyre) {
    res.status(200).json(existingTyre);
  } else {
    res.status(400).json("Tyre does not exist");
  }
});

export default router;
