import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import axios from "axios";

export const convertUserDataTOPDF = async (userData) => {

  return new Promise((resolve, reject) => {

    const fileName = crypto.randomBytes(16).toString("hex") + ".pdf";
    const outputPath = "uploads/" + fileName;

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(outputPath);

    doc.pipe(stream);

    


    doc.fontSize(14).text(`Name: ${userData?.userId?.name || ""}`);
    doc.text(`Username: ${userData?.userId?.username || ""}`);
    doc.text(`Email: ${userData?.userId?.email || ""}`);
    doc.text(`Bio: ${userData?.bio || ""}`);
    doc.text(`Current Post: ${userData?.currentPost || ""}`);

    doc.moveDown();
    doc.text("Past Work:");

    if (Array.isArray(userData?.pastWork)) {
      userData.pastWork.forEach((work) => {
        doc.text(`Company: ${work.company || ""}`);
        doc.text(`Position: ${work.position || ""}`);
        doc.text(`Years: ${work.years || ""}`);
        doc.moveDown();
      });
    }
    doc.moveDown();
doc.text("Education:");

if (Array.isArray(userData?.education)) {
  userData.education.forEach((edu) => {
    doc.text(`School: ${edu.school || ""}`);
    doc.text(`Degree: ${edu.degree || ""}`);
    doc.text(`Field Of Study: ${edu.fieldOfStudy || ""}`);
    doc.moveDown();
  });
}

    doc.end();

    stream.on("finish", async () => {
      console.log(
  "LOCAL PDF SIZE:",
  fs.statSync(outputPath).size
);
  try {

resolve(outputPath);

  } catch (error) {
    console.log("CLOUDINARY PDF ERROR:", error);
    reject(error);
  }
});

stream.on("error", reject);

  });

};