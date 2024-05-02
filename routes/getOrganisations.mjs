import express from "express";
import OrganisationMaster from "../models/master/OrganisationMaster.mjs";

const router = express.Router();

router.get("/api/getOrganisations", async (req, res) => {
  const data = await OrganisationMaster.find({});
  const resData = data.map((item) => item.name);
  res.status(200).json(resData);
});

export default router;
