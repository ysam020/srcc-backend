import express from "express";
import TyreModel from "../../models/tyreModel.mjs";

const router = express.Router();

router.get("/api/getTyreNumber", async (req, res) => {
  try {
    const existingTyres = await TyreModel.find({}).select("tyre_no");
    const tyreNumbers = existingTyres.map((tyre) => tyre.tyre_no);

    if (tyreNumbers.length > 0) {
      res.status(200).json(tyreNumbers);
    } else {
      res.status(200).json({ message: "No tyre fitting found" });
    }
  } catch (error) {
    // Handle any errors, e.g., database connection issues
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
