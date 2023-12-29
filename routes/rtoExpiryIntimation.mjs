import express from "express";
import sgMail from "@sendgrid/mail";
import schedule from "node-schedule";
import RTO from "../models/rtoModel.mjs";

sgMail.setApiKey(process.env.SENDGRID_API);
const router = express.Router();

schedule.scheduleJob("00 22 * * */1", async () => {
  // schedule.scheduleJob("*/10 * * * * *", async () => {
  try {
    const rto_docs = await RTO.find(
      {},
      {
        fitness_document_expiry_date: 1,
        inspection_due_date: 1,
        mv_tax_date: 1,
        insurance_expiry_date: 1,
        puc_expiry_date: 1,
        goods_permit_validity_date: 1,
        national_permit_validity_date: 1,
      }
    );

    const currentDate = new Date();
    const fifteenDaysFromNow = new Date();
    fifteenDaysFromNow.setDate(fifteenDaysFromNow.getDate() + 15);

    const documentsToNotify = [];

    rto_docs.forEach((doc) => {
      Object.keys(doc._doc).forEach((key) => {
        const expirationDate = new Date(doc[key] + "T00:00:00Z");
        if (
          !isNaN(expirationDate.getTime()) &&
          expirationDate >= currentDate &&
          expirationDate <= fifteenDaysFromNow
        ) {
          documentsToNotify.push({
            document: key,
            expirationDate: expirationDate,
          });
        }
      });
    });

    if (documentsToNotify.length > 0) {
      const mailContent = documentsToNotify
        .map(
          (doc) =>
            `The ${
              doc.document
            } is expiring on ${doc.expirationDate.toDateString()}`
        )
        .join("\n");

      console.log(mailContent);

      const msg = {
        to: ["ceo@srcontainercarriers.com", "suraj@alluvium.in"],
        from: "helpdesk@alluvium.in",
        subject: "Expiring Documents Notification",
        text: mailContent,
      };

      sgMail
        .send(msg)
        .then(() => {
          console.log("Email notification sent.");
        })
        .catch((error) => {
          console.error("Error sending email:", error);
        });
    }
  } catch (err) {
    console.log(err);
  }
});

export default router;
