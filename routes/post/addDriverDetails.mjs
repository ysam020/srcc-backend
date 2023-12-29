import express from "express";
import DriverDetails from "../../models/master/driverDetails.mjs";

const router = express.Router();

router.post("/api/addDriverDetails", async (req, res) => {
  const {
    driver_name,
    driver_license,
    license_validity,
    driver_address,
    driver_phone,
  } = req.body;
  console.log(req.body);
  try {
    const existingDriver = await DriverDetails.findOne({
      driver_name,
    });

    if (existingDriver) {
      res.status(200).json({ message: "Driver already exists" });
    } else {
      const newDriver = new DriverDetails({
        driver_name,
        driver_license,
        license_validity,
        driver_address,
        driver_phone,
        _date: new Date().toLocaleDateString("en-GB"),
      });
      await newDriver.save();
      res.status(200).json({ message: "Driver added successfully" });
    }
  } catch (err) {
    console.log(err);
  }
});

export default router;
