import express from "express";
import TyreSize from "../../models/master/tyreSizes.mjs";
const router = express.Router();

router.get("/api/getTyreSize", async (req, res) => {
  const existingTyreSize = await TyreSize.find({});
  if (existingTyreSize) {
    res.status(200).json(existingTyreSize);
  } else {
    res.status(200).json({ message: "No tyre size found" });
  }
});

export default router;
