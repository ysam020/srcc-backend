import mongoose from "mongoose";

const truckSchema = new mongoose.Schema({
  truck_no: { type: String },
  drivers: [
    {
      driver_name: { type: String },
      driver_address: { type: String },
      driver_phone: { type: String },
      driver_license: { type: String },
      license_validity: { type: String },
      assign_date: { type: String },
      assign_date_odometer: { type: String },
    },
  ],
  tyres: [
    {
      tyre_no: { type: String },
      location: { type: String },
      fitting_date: { type: String },
      fitting_date_odometer: { type: String },
      withdrawal_date: { type: String },
      withdrawal_date_odometer: { type: String },
    },
  ],
});

const Truck = mongoose.model("Truck", truckSchema);
export default Truck;
