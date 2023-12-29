import express from "express";
import sgMail from "@sendgrid/mail";
import schedule from "node-schedule";
import Vendors from "../models/master/vendors.mjs";
import Vehicles from "../models/master/vehicles.mjs";
import TyreTypes from "../models/master/tyreTypes.mjs";
import TyreBrands from "../models/master/tyreBrand.mjs";
import TyreModels from "../models/master/tyreModels.mjs";
import TyreSizes from "../models/master/tyreSizes.mjs";
import PlyRatings from "../models/master/plyRatings.mjs";
import DriverDetails from "../models/master/driverDetails.mjs";
import RepairTypes from "../models/master/repairTypes.mjs";
import Tyre from "../models/tyreModel.mjs";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

sgMail.setApiKey(process.env.SENDGRID_API);
const router = express.Router();
const todayDateString = new Date().toLocaleDateString("en-GB");

// schedule.scheduleJob("*/10 * * * * *", async () => {
schedule.scheduleJob("00 23 * * */1", async () => {
  const vendors = await Vendors.find({ _date: todayDateString });
  const vehicles = await Vehicles.find({ _date: todayDateString });
  const tyreTypes = await TyreTypes.find({ _date: todayDateString });
  const tyreBrands = await TyreBrands.find({ _date: todayDateString });
  const tyreModels = await TyreModels.find({ _date: todayDateString });
  const tyreSizes = await TyreSizes.find({ _date: todayDateString });
  const plyRatings = await PlyRatings.find({ _date: todayDateString });
  const driverDetails = await DriverDetails.find({ _date: todayDateString });
  const repairTypes = await RepairTypes.find({ _date: todayDateString });
  const blastTyre = await Tyre.find({
    _tyre_blast_date_added: todayDateString,
  });

  const tyreFitting = await Tyre.aggregate([
    {
      $unwind: "$trucks",
    },
    {
      $match: {
        "trucks._fitting_date_added": todayDateString,
      },
    },
    {
      $group: {
        _id: "$_id",
        trucks: { $push: "$trucks" },
      },
    },
  ]);

  try {
    const generatePdf = async () => {
      const vendorData = vendors.map((vendor) => ({
        "Vendor Name": vendor.vendor_name,
        "Vendor Address": vendor.vendor_address,
        "Vendor Phone": vendor.vendor_phone,
      }));

      const vehicleData = vehicles.map((vehicle) => ({
        "Truck Number": vehicle.truck_no,
        "Max Tyres": vehicle.max_tyres,
        Units: vehicle.units,
      }));

      const tyreTypeData = tyreTypes.map((vehicle) => ({
        "Tyre Type": vehicle.tyre_type,
      }));

      const tyreBrandData = tyreBrands.map((vehicle) => ({
        "Tyre Brand": vehicle.tyre_brand,
        Description: vehicle.description,
      }));

      const tyreModelData = tyreModels.map((vehicle) => ({
        "Tyre Brand": vehicle.tyre_brand,
        Model: vehicle.tyre_model,
        Description: vehicle.description,
      }));

      const tyreSizeData = tyreSizes.map((vehicle) => ({
        "Tyre Size": vehicle.tyre_size,
      }));

      const plyRatingData = plyRatings.map((vehicle) => ({
        "Ply Rating": vehicle.ply_rating,
      }));

      const driverDetailsData = driverDetails.map((driver) => ({
        "Driver Name": driver.driver_name,
        "Driver Address": driver.driver_address,
        "Driver Phone": driver.driver_phone,
        "Driver License": driver.driver_license,
        "License Validity": driver.license_validity,
      }));

      const repairTypesData = repairTypes.map((vehicle) => ({
        "Repair Type": vehicle.repair_type,
      }));

      const blastData = blastTyre.map((tyre) => ({
        "Truck No": tyre.blast_truck_no,
        "Blast Date": tyre.blast_date,
        "Blast Driver": tyre.blast_driver,
        "Blast Odometer": tyre.blast_odometer,
      }));

      //   ******************************
      const pdf = new jsPDF("p", "pt", "a4", true);

      // *****************************************************************************************   Header
      // Add the background color up to 20% from the top
      const headerHeight = pdf.internal.pageSize.getHeight() * 0.2;
      pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), headerHeight, "F");

      const headerBgImagePath = path.join(__dirname, "../images/bg.png");

      // Read and convert the image to base64
      const getBase64Data = async (imagePath) => {
        const data = await fs.promises.readFile(imagePath);
        return Buffer.from(data).toString("base64");
      };

      // Get the base64-encoded image data
      const headerBgImageData = await getBase64Data(headerBgImagePath);

      // Add the header background image
      pdf.addImage(
        headerBgImageData,
        "PNG",
        0,
        0,
        pdf.internal.pageSize.getWidth(),
        headerHeight
      );

      const textY = headerHeight / 2;

      // Add the logo
      const headerImagePath = path.join(__dirname, "../images/logo.png");
      const headerImageData = await getBase64Data(headerImagePath);
      const headerImgWidth = 100;
      const headerImgHeight = 50;

      pdf.addImage(
        headerImageData,
        "PNG",
        40,
        textY - 10 - 25,
        headerImgWidth,
        headerImgHeight
      );

      // Calculate the x-coordinate for aligning the headings to the right
      const headingX = pdf.internal.pageSize.getWidth() - 40;

      const titleText = "SR Container and Cariers";
      const subtitleText = `Daily Report`;

      pdf.setFontSize(24);
      pdf.setTextColor("#ffffff");
      pdf.text(titleText, headingX, textY - 10, null, null, "right");
      pdf.setFontSize(14);
      pdf.text(subtitleText, headingX, textY + 10, null, null, "right");
      pdf.setFontSize(12);

      // *****************************************************************************************   Tables
      let verticalPosition = headerHeight + 40;
      pdf.setFontSize(16);
      pdf.setTextColor("#000000");
      pdf.text("1. New vendor", 40, verticalPosition, null, null, "left");

      //   1. Vendors
      const vendorHeaders = ["Vendor Name", "Vendor Address", "Vendor Phone"];

      const vendorJSON = vendorData.map((item, index) => {
        return [
          {
            content: item["Vendor Name"],
            styles: {
              fillColor: index % 2 === 0 ? "#F0F0F0" : "#F8F8F8",
            },
          },
          {
            content: item["Vendor Address"],
            styles: {
              fillColor: index % 2 === 0 ? "#F0F0F0" : "#F8F8F8",
            },
          },
          {
            content: item["Vendor Phone"],
            styles: {
              fillColor: index % 2 === 0 ? "#F0F0F0" : "#F8F8F8",
            },
          },
        ];
      });

      pdf.autoTable({
        startY: verticalPosition + 10,
        head: [vendorHeaders],
        body: vendorJSON.length > 0 ? vendorJSON : [["NA", "NA", "NA"]],
        styles: {
          halign: "center",
          valign: "middle",
          fontSize: 12,
          cellPadding: 5,
        },
        headStyles: {
          fillColor: "#484848",
          textColor: "#fff",
          fontStyle: "bold",
        },
        columnStyles: {
          Timing: { fontStyle: "bold" },
          "Production Count": { fontStyle: "bold" },
        },
      });

      //   2. Vehicles
      verticalPosition = pdf.autoTable.previous.finalY + 30;
      pdf.setFontSize(16);
      pdf.setTextColor("#000000");
      pdf.text("2. New Vehicle", 40, verticalPosition, null, null, "left");
      const vehicleHeaders = ["Truck No", "Max Tyres", "Units"];
      const vehicleJSON = vehicleData.map((item, index) => {
        return [
          {
            content: item["Truck Number"],
            styles: {
              fillColor: index % 2 === 0 ? "#F0F0F0" : "#F8F8F8",
            },
          },
          {
            content: item["Max Tyres"],
            styles: {
              fillColor: index % 2 === 0 ? "#F0F0F0" : "#F8F8F8",
            },
          },
          {
            content: item["Units"],
            styles: {
              fillColor: index % 2 === 0 ? "#F0F0F0" : "#F8F8F8",
            },
          },
        ];
      });

      pdf.autoTable({
        startY: verticalPosition + 10,
        head: [vehicleHeaders],
        body: vehicleJSON.length > 0 ? vehicleJSON : [["NA", "NA", "NA"]],
        styles: {
          halign: "center",
          valign: "middle",
          fontSize: 12,
          cellPadding: 5,
        },
        headStyles: {
          fillColor: "#484848",
          textColor: "#fff",
          fontStyle: "bold",
        },
        columnStyles: {
          Timing: { fontStyle: "bold" },
          "Production Count": { fontStyle: "bold" },
        },
      });

      //   3. Tyre types
      verticalPosition = pdf.autoTable.previous.finalY + 30;
      pdf.setFontSize(16);
      pdf.setTextColor("#000000");
      pdf.text("3. New Tyre", 40, verticalPosition, null, null, "left");
      const tyreTypeHeaders = ["Tyre Type"];
      const tyreTypeJSON = tyreTypeData.map((item, index) => {
        return [
          {
            content: item["Tyre Type"],
            styles: {
              fillColor: index % 2 === 0 ? "#F0F0F0" : "#F8F8F8",
            },
          },
        ];
      });

      pdf.autoTable({
        startY: verticalPosition + 10,
        head: [tyreTypeHeaders],
        body: tyreTypeJSON.length > 0 ? tyreTypeJSON : [["NA"]],
        styles: {
          halign: "center",
          valign: "middle",
          fontSize: 12,
          cellPadding: 5,
        },
        headStyles: {
          fillColor: "#484848",
          textColor: "#fff",
          fontStyle: "bold",
        },
        columnStyles: {
          Timing: { fontStyle: "bold" },
          "Production Count": { fontStyle: "bold" },
        },
      });

      //   4. Tyre brands
      verticalPosition = pdf.autoTable.previous.finalY + 30;
      pdf.setFontSize(16);
      pdf.setTextColor("#000000");
      pdf.text("4. New Tyre Brand", 40, verticalPosition, null, null, "left");
      const tyreBrandHeaders = ["Tyre Brand", "Description"];
      const tyreBrandJSON = tyreBrandData.map((item, index) => {
        return [
          {
            content: item["Tyre Brand"],
            styles: {
              fillColor: index % 2 === 0 ? "#F0F0F0" : "#F8F8F8",
            },
          },
          {
            content: item["Description"],
            styles: {
              fillColor: index % 2 === 0 ? "#F0F0F0" : "#F8F8F8",
            },
          },
        ];
      });

      pdf.autoTable({
        startY: verticalPosition + 10,
        head: [tyreBrandHeaders],
        body: tyreBrandJSON.length > 0 ? tyreBrandJSON : [["NA", "NA"]],
        styles: {
          halign: "center",
          valign: "middle",
          fontSize: 12,
          cellPadding: 5,
        },
        headStyles: {
          fillColor: "#484848",
          textColor: "#fff",
          fontStyle: "bold",
        },
        columnStyles: {
          Timing: { fontStyle: "bold" },
          "Production Count": { fontStyle: "bold" },
        },
      });

      //   5. Tyre models
      verticalPosition = pdf.autoTable.previous.finalY + 30;
      pdf.setFontSize(16);
      pdf.setTextColor("#000000");
      pdf.text("5. New Tyre Model", 40, verticalPosition, null, null, "left");

      const tyreModelHeaders = ["Tyre Brand", "Model", "Description"];
      const tyreModelJSON = tyreModelData.map((item, index) => {
        return [
          {
            content: item["Tyre Brand"],
            styles: {
              fillColor: index % 2 === 0 ? "#F0F0F0" : "#F8F8F8",
            },
          },
          {
            content: item["Model"],
            styles: {
              fillColor: index % 2 === 0 ? "#F0F0F0" : "#F8F8F8",
            },
          },
          {
            content: item["Description"],
            styles: {
              fillColor: index % 2 === 0 ? "#F0F0F0" : "#F8F8F8",
            },
          },
        ];
      });

      pdf.autoTable({
        startY: verticalPosition + 10,
        head: [tyreModelHeaders],
        body: tyreModelJSON.length > 0 ? tyreModelJSON : [["NA", "NA", "NA"]],
        styles: {
          halign: "center",
          valign: "middle",
          fontSize: 12,
          cellPadding: 5,
        },
        headStyles: {
          fillColor: "#484848",
          textColor: "#fff",
          fontStyle: "bold",
        },
        columnStyles: {
          Timing: { fontStyle: "bold" },
          "Production Count": { fontStyle: "bold" },
        },
      });

      //   6. Tyre sizes
      verticalPosition = pdf.autoTable.previous.finalY + 30;
      pdf.setFontSize(16);
      pdf.setTextColor("#000000");
      pdf.text("6. New Tyre Size", 40, verticalPosition, null, null, "left");
      const tyreSizeHeaders = ["Tyre Size"];
      const tyreSizeJSON = tyreSizeData.map((item, index) => {
        return [
          {
            content: item["Tyre Size"],
            styles: {
              fillColor: index % 2 === 0 ? "#F0F0F0" : "#F8F8F8",
            },
          },
        ];
      });

      pdf.autoTable({
        startY: verticalPosition + 10,
        head: [tyreSizeHeaders],
        body: tyreSizeJSON.length > 0 ? tyreSizeJSON : [["NA"]],
        styles: {
          halign: "center",
          valign: "middle",
          fontSize: 12,
          cellPadding: 5,
        },
        headStyles: {
          fillColor: "#484848",
          textColor: "#fff",
          fontStyle: "bold",
        },
        columnStyles: {
          Timing: { fontStyle: "bold" },
          "Production Count": { fontStyle: "bold" },
        },
      });

      //   7. Ply Ratings
      pdf.addPage();
      verticalPosition = 50;
      pdf.setFontSize(16);
      pdf.setTextColor("#000000");
      pdf.text("7. New Ply Rating", 40, verticalPosition, null, null, "left");
      const plyRatingHeaders = ["Ply Rating"];
      const plyRatingJSON = plyRatingData.map((item, index) => {
        return [
          {
            content: item["Ply Rating"],
            styles: {
              fillColor: index % 2 === 0 ? "#F0F0F0" : "#F8F8F8",
            },
          },
        ];
      });

      pdf.autoTable({
        startY: verticalPosition + 10,
        head: [plyRatingHeaders],
        body: plyRatingJSON.length > 0 ? plyRatingJSON : [["NA"]],
        styles: {
          halign: "center",
          valign: "middle",
          fontSize: 12,
          cellPadding: 5,
        },
        headStyles: {
          fillColor: "#484848",
          textColor: "#fff",
          fontStyle: "bold",
        },
        columnStyles: {
          Timing: { fontStyle: "bold" },
          "Production Count": { fontStyle: "bold" },
        },
      });

      //   8. Driver details
      verticalPosition = pdf.autoTable.previous.finalY + 30;
      pdf.setFontSize(16);
      pdf.setTextColor("#000000");
      pdf.text(
        "8. New Driver Details",
        40,
        verticalPosition,
        null,
        null,
        "left"
      );
      const driverDetailsHeaders = [
        "Driver Name",
        "Driver Address",
        "Driver Phone",
        "Driver License",
        "License Validity",
      ];
      const driverDetailsJSON = driverDetailsData.map((item, index) => {
        return [
          {
            content: item["Driver Name"],
            styles: {
              fillColor: index % 2 === 0 ? "#F0F0F0" : "#F8F8F8",
            },
          },
          {
            content: item["Driver Address"],
            styles: {
              fillColor: index % 2 === 0 ? "#F0F0F0" : "#F8F8F8",
            },
          },
          {
            content: item["Driver Phone"],
            styles: {
              fillColor: index % 2 === 0 ? "#F0F0F0" : "#F8F8F8",
            },
          },
          {
            content: item["Driver License"],
            styles: {
              fillColor: index % 2 === 0 ? "#F0F0F0" : "#F8F8F8",
            },
          },
          {
            content: item["License Validity"],
            styles: {
              fillColor: index % 2 === 0 ? "#F0F0F0" : "#F8F8F8",
            },
          },
        ];
      });

      pdf.autoTable({
        startY: verticalPosition + 10,
        head: [driverDetailsHeaders],
        body:
          driverDetailsJSON.length > 0
            ? driverDetailsJSON
            : [["NA", "NA", "NA", "NA", "NA"]],
        styles: {
          halign: "center",
          valign: "middle",
          fontSize: 12,
          cellPadding: 5,
        },
        headStyles: {
          fillColor: "#484848",
          textColor: "#fff",
          fontStyle: "bold",
        },
        columnStyles: {
          Timing: { fontStyle: "bold" },
          "Production Count": { fontStyle: "bold" },
        },
      });

      //   9. Repair types
      verticalPosition = pdf.autoTable.previous.finalY + 30;
      pdf.setFontSize(16);
      pdf.setTextColor("#000000");
      pdf.text("9. New Repair Types", 40, verticalPosition, null, null, "left");
      const repairtypeHeaders = ["Repair Type"];
      const repairTypeJSON = repairTypesData.map((item, index) => {
        return [
          {
            content: item["Repair Type"],
            styles: {
              fillColor: index % 2 === 0 ? "#F0F0F0" : "#F8F8F8",
            },
          },
        ];
      });

      pdf.autoTable({
        startY: verticalPosition + 10,
        head: [repairtypeHeaders],
        body: repairTypeJSON.length > 0 ? repairTypeJSON : [["NA"]],
        styles: {
          halign: "center",
          valign: "middle",
          fontSize: 12,
          cellPadding: 5,
        },
        headStyles: {
          fillColor: "#484848",
          textColor: "#fff",
          fontStyle: "bold",
        },
        columnStyles: {
          Timing: { fontStyle: "bold" },
          "Production Count": { fontStyle: "bold" },
        },
      });

      //   10. Tyre Blast
      verticalPosition = pdf.autoTable.previous.finalY + 30;
      pdf.setFontSize(16);
      pdf.setTextColor("#000000");
      pdf.text(
        "10. Tyre Blast Details",
        40,
        verticalPosition,
        null,
        null,
        "left"
      );
      const tyreBlastHeaders = [
        "Truck No",
        "Blast Date",
        "Blast Driver",
        "Blast Odometer",
      ];
      const tyreBlastJSON = blastData.map((item, index) => {
        return [
          {
            content: item["Truck No"],
            styles: {
              fillColor: index % 2 === 0 ? "#F0F0F0" : "#F8F8F8",
            },
          },
          {
            content: item["Blast Date"],
            styles: {
              fillColor: index % 2 === 0 ? "#F0F0F0" : "#F8F8F8",
            },
          },
          {
            content: item["Blast Driver"],
            styles: {
              fillColor: index % 2 === 0 ? "#F0F0F0" : "#F8F8F8",
            },
          },
          {
            content: item["Blast Odometer"],
            styles: {
              fillColor: index % 2 === 0 ? "#F0F0F0" : "#F8F8F8",
            },
          },
        ];
      });

      pdf.autoTable({
        startY: verticalPosition + 10,
        head: [tyreBlastHeaders],
        body:
          tyreBlastJSON.length > 0 ? tyreBlastJSON : [["NA", "NA", "NA", "NA"]],
        styles: {
          halign: "center",
          valign: "middle",
          fontSize: 12,
          cellPadding: 5,
        },
        headStyles: {
          fillColor: "#484848",
          textColor: "#fff",
          fontStyle: "bold",
        },
        columnStyles: {
          Timing: { fontStyle: "bold" },
          "Production Count": { fontStyle: "bold" },
        },
      });

      // ********************************************************************************   Footer
      // Add another image at the footer
      const footerImgWidth = 150; // Adjust the width of the footer image as needed
      const footerImgHeight = 20;
      const footerTextX = 40 + footerImgWidth + 10;

      // Set the line color to light gray (R, G, B values)
      pdf.setDrawColor(200, 200, 200);

      // Calculate the Y-coordinate for the line
      const lineY = pdf.internal.pageSize.getHeight() - footerImgHeight - 30; // Adjust the value to control the vertical position of the line

      // Draw the horizontal line
      pdf.line(40, lineY, pdf.internal.pageSize.getWidth() - 40, lineY);

      const footerImgPath = path.join(__dirname, "../images/logo.png");
      const footerImgData = await getBase64Data(footerImgPath);
      pdf.addImage(
        footerImgData,
        "PNG",
        40,
        pdf.internal.pageSize.getHeight() - footerImgHeight - 20,
        footerImgWidth,
        footerImgHeight
      );

      const footerTextY =
        pdf.internal.pageSize.getHeight() - footerImgHeight - 17; // Adjust the value to control the vertical position of the text
      const companyText = "Alluvium IOT Solutions Pvt. Ltd.";
      const addressText = "A-306, Wallstreet 2, Ellisbridge";
      const cityText = "Ahmedabad, Gujarat";
      const contactText = "+91 9924300511";

      pdf.setFontSize(8);
      pdf.setTextColor("#000000");
      pdf.text(companyText, footerTextX, footerTextY, null, null, "left");
      pdf.text(addressText, footerTextX, footerTextY + 10, null, null, "left");
      pdf.text(cityText, footerTextX, footerTextY + 20, null, null, "left");
      pdf.text(contactText, footerTextX, footerTextY + 30, null, null, "left");

      // Save the PDF file
      const filename = `report.pdf`;
      const pdfFilePath = path.join(__dirname, filename);
      pdf.save(pdfFilePath);

      // Read the PDF file and encode it to base64
      const pdfData = fs.readFileSync(pdfFilePath);
      const pdfBase64 = pdfData.toString("base64");

      // Send the PDF as an attachment via SendGrid
      const msg = {
        to: ["ceo@srcontainercarriers.com", "suraj@alluvium.in"],
        // to: "sameery.020@gmail.com",
        from: "helpdesk@alluvium.in",
        subject: "Production Report",
        text: "Please find the production report attached.",
        attachments: [
          {
            filename: filename,
            content: pdfBase64, // Attach the base64-encoded PDF content
            type: "application/pdf", // Specify the content type
            disposition: "attachment",
          },
        ],
      };

      try {
        // await sgMail.send(msg);
        console.log("Email sent successfully.");
      } catch (error) {
        console.error("Error sending email:", error);
      }
    };
    await generatePdf();
  } catch (err) {
    console.log(err);
  }
});

export default router;
