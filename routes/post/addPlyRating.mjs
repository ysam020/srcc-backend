import express from "express";
import PlyRatings from "../../models/master/plyRatings.mjs";

const router = express.Router();

router.post("/api/addPlyRating", async (req, res) => {
  const { ply_rating } = req.body;
  console.log(ply_rating);

  const existingPlyRating = await PlyRatings.findOne({ ply_rating });
  if (existingPlyRating) {
    res.status(200).json({ message: "Ply rating already exists" });
  } else {
    const newPlyRating = new PlyRatings({
      ply_rating,
      _date: new Date().toLocaleDateString("en-GB"),
    });
    await newPlyRating.save();
    res.status(200).json({ message: "Ply rating added successfully" });
  }
});

export default router;
