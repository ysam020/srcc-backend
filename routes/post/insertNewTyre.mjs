import express from "express";
import Tyre from "../../models/tyreModel.mjs";
import tyreModels from "../../models/master/tyreModels.mjs";
import Vendors from "../../models/master/vendors.mjs";

const router = express.Router();

router.post("/insertNewTyre", async (req, res) => {
  const {
    tyre_no,
    bill_no,
    bill_date,
    vendor_name,
    tyre_model,
    tyre_brand,
    tyre_type,
    tyre_size,
    ply_rating,
    warranty_date,
    invoiceImages,
  } = req.body;

  try {
    const existingTyre = await Tyre.findOne({ tyre_no });
    if (existingTyre) {
      res.status(200).send({ message: "Tyre already exists" });
    } else {
      const existingBrand = await tyreModels.findOne({ tyre_model });
      const existingVendor = await Vendors.findOne({ vendor_name });
      const newTyre = new Tyre({
        tyre_no,
        bill_no,
        bill_date,
        warranty_date,
        vendor_name,
        vendor_address: existingVendor.vendor_address,
        vendor_phone: existingVendor.vendor_phone,
        tyre_model,
        tyre_brand,
        tyre_type,
        tyre_size,
        ply_rating,
        tyre_brand: existingBrand.tyre_brand,
        new_tyre_invoice_images: invoiceImages,
        _new_tyre_date: new Date().toLocaleDateString("en-GB"),
      });
      await newTyre.save();
      res.status(200).json({ message: "Tyre inserted successfully" });
    }
  } catch (err) {
    // Handle any errors here
    console.error(err);
    res.status(500).json({ message: "An error occurred" });
  }
});

export default router;
