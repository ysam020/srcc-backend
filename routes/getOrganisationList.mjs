import express from "express";
import OrganisationMaster from "../models/master/OrganisationMaster.mjs";

const router = express.Router();

router.get("/api/getOrganisationList", async (req, res) => {
  const data = await OrganisationMaster.find();
  res.status(200).json(data);
});

export default router;
