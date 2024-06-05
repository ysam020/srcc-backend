import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import insertNewTure from "./routes/post/insertNewTyre.mjs";
import tyreDetails from "./routes/tyreDetails.mjs";
// Post ***********************************************************************
import addVendor from "./routes/post/addVendor.mjs";
import addVehicle from "./routes/post/addVehicle.mjs";
import addTyreType from "./routes/post/addTyreType.mjs";
import addTyreSize from "./routes/post/addTyreSize.mjs";
import addTyreModel from "./routes/post/addTyreModel.mjs";
import addTyreBrand from "./routes/post/addTyreBrand.mjs";
import addRepairType from "./routes/post/addRepairType.mjs";
import addPlyRating from "./routes/post/addPlyRating.mjs";
import addDriverDetails from "./routes/post/addDriverDetails.mjs";
import tyreRepair from "./routes/post/tyreRepair.mjs";
import tyreBlast from "./routes/post/tyreBlast.mjs";
import tyreRetreading from "./routes/post/tyreRetreading.mjs";
import truckTyres from "./routes/post/addTruckTyres.mjs";
import driverAssignment from "./routes/post/driverAssignment.mjs";
import addTypeOfVehicle from "./routes/post/addTypeOfVehicle.mjs";
import addContainerType from "./routes/post/addContainerType.mjs";
// Get ***********************************************************************
import getVendors from "./routes/get/getVendors.mjs";
import getTyreModel from "./routes/get/getTyreModel.mjs";
import getTyreMake from "./routes/get/getTyreMake.mjs";
import getTyreType from "./routes/get/getTyreType.mjs";
import getTyreSize from "./routes/get/getTyreSize.mjs";
import getPlyRating from "./routes/get/getPlyRating.mjs";
import getTyreBrand from "./routes/get/getTyreBrand.mjs";
import tyreFitting from "./routes/post/tyreFitting.mjs";
import getTruckNumber from "./routes/get/getTruckNumber.mjs";
import getTyreNumber from "./routes/get/getTyreNumber.mjs";
import getRepairType from "./routes/get/getRepairType.mjs";
import getDrivers from "./routes/get/getDrivers.mjs";
import getTypeOfVehicle from "./routes/get/getTypeOfVehicle.mjs";
import getContainerTypes from "./routes/get/getContainerTypes.mjs";
// import mailReport from "./routes/mailReport.mjs";
// import tyreWarrantyIntimaton from "./routes/tyreWarrantyIntimation.mjs";
import rto from "./routes/rto.mjs";
import getRto from "./routes/getRto.mjs";
import rtoExpiryIntimation from "./routes/rtoExpiryIntimation.mjs";
import getTruckDetails from "./routes/get/getTruckDetails.mjs";
import engineOilRestock from "./routes/restockEngineOil.mjs";
import engineOilDistribution from "./routes/engineOilDistribution.mjs";
import getEngineOilStock from "./routes/getEngineOilStock.mjs";
import viewEngineOil from "./routes/viewEnigneOil.mjs";
import addLocationMaster from "./routes/addLocationMaster.mjs";
import addOrganisationMaster from "./routes/addOrganisationMaster.mjs";
import getOrganisationData from "./routes/getOrganisationData.mjs";
import getOrganisationList from "./routes/getOrganisationList.mjs";
import addOrganisationAddress from "./routes/addOrganisationAddress.mjs";
import getOrganisations from "./routes/getOrganisations.mjs";
import getTruckNumberWithType from "./routes/get/getTruckNumberWithType.mjs";

const app = express();
app.use(bodyParser.json({ limit: "100mb" }));
app.use(cors());
app.use(express.json());

mongoose
  .connect(
    // "mongodb://localhost:27017/srcc",
    "mongodb+srv://sameery020:CId21lR1oWh6Od19@cluster0.pelnvme.mongodb.net/srcc?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    app.use(insertNewTure);
    app.use(tyreDetails);
    app.use(addVendor);
    app.use(addVehicle);
    app.use(addTyreType);
    app.use(addTyreSize);
    app.use(addTyreModel);
    app.use(addTyreBrand);
    app.use(addRepairType);
    app.use(addPlyRating);
    app.use(addDriverDetails);
    app.use(tyreRepair);
    app.use(tyreBlast);
    app.use(tyreRetreading);
    app.use(truckTyres);
    app.use(driverAssignment);
    app.use(addTypeOfVehicle);
    app.use(addContainerType);

    app.use(getVendors);
    app.use(getTyreModel);
    app.use(getTyreMake);
    app.use(getTyreType);
    app.use(getTyreSize);
    app.use(getPlyRating);
    app.use(getTyreBrand);
    app.use(getTruckNumber);
    app.use(getTyreNumber);
    app.use(getRepairType);
    app.use(getDrivers);
    app.use(getTruckDetails);
    app.use(getTypeOfVehicle);
    app.use(getContainerTypes);

    app.use(tyreFitting);

    app.use(rto);
    app.use(getRto);
    app.use(rtoExpiryIntimation);
    app.use(engineOilRestock);
    app.use(engineOilDistribution);
    app.use(getEngineOilStock);
    app.use(viewEngineOil);

    app.use(addLocationMaster);
    app.use(addOrganisationMaster);
    app.use(getOrganisationData);
    app.use(getOrganisations);
    app.use(getOrganisationList);
    app.use(getTruckNumberWithType);
    app.use(addOrganisationAddress);

    app.listen(8000, () => {
      console.log("Server is running on port 8000");
    });
  });
