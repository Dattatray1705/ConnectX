import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function test() {
  try {
    console.log("EMAIL_USER =", process.env.EMAIL_USER);
    console.log("EMAIL_PASS EXISTS =", !!process.env.EMAIL_PASS);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("Verifying SMTP...");
    await transporter.verify();
    console.log("✅ SMTP Connected");

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Test Mail",
      text: "Hello from ConnectX",
    });

    console.log("✅ Mail Sent");
    console.log(info);

  } catch (err) {
    console.error("ERROR:");
    console.error(err);
  }
}

test();