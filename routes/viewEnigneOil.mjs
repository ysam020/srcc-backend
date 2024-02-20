import express from "express";
import engineOilDistribution from "../models/engineOilDistribution.mjs";

const router = express.Router();

router.get("/api/viewEngineOil", async (req, res) => {
  const data = await engineOilDistribution.find({});

  res.status(200).send(data);
});

export default router;
