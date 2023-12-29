import express from "express";
import sgMail from "@sendgrid/mail";
import schedule from "node-schedule";
import tyreModels from "../models/tyreModel.mjs";

sgMail.setApiKey(process.env.SENDGRID_API);
const router = express.Router();

// schedule.scheduleJob("*/10 * * * * *", async () => {
schedule.scheduleJob("00 22 * * */1", async () => {
  try {
    const tyres = await tyreModels.find({});
    const currentDate = new Date();

    tyres.forEach(async (tyre) => {
      const expirationDate = new Date(tyre.warranty_date);
      const oneMonthBeforeExpiration = new Date(expirationDate);
      oneMonthBeforeExpiration.setMonth(
        oneMonthBeforeExpiration.getMonth() - 1
      );

      if (
        currentDate >= oneMonthBeforeExpiration &&
        currentDate < expirationDate
      ) {
        const msg = {
          to: ["ceo@srcontainercarriers.com", "suraj@alluvium.in"],
          from: "helpdesk@alluvium.in",
          subject: "Tyre Warranty Expiration",
          text: `The warranty of tyre ID ${tyre.tyre_no} is expiring on ${tyre.warranty_date}.`,
        };
        try {
          await sgMail.send(msg);
          console.log(`Email sent for tyre number ${tyre._id}`);
        } catch (error) {
          console.error(`Error sending email for tyre ID ${tyre._id}:`, error);
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
});

export default router;
