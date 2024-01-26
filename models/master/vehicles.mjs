import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  truck_no: { type: String, trim: true },
  max_tyres: { type: String, trim: true },
  units: { type: String, trim: true },
  _date: { type: String, trim: true },
});

export default mongoose.model("Vehicles", vehicleSchema);
