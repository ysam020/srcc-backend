import mongoose from "mongoose";

const locationMasterSchema = new mongoose.Schema({
  district: { type: String, trim: true },
  area: [
    {
      area: { type: String, trim: true },
      pincode: { type: String, trim: true },
    },
  ],
});

export default mongoose.model("LocationMaster", locationMasterSchema);
