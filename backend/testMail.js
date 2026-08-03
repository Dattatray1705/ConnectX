import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

try {
  console.log("Testing SMTP...");

  await transporter.verify();

  console.log("SMTP Connected");

  const info = await transporter.sendMail({
    from: process.env.BREVO_USER,
    to: process.env.BREVO_USER,
    subject: "SMTP Test",
    text: "Brevo SMTP is working",
  });

  console.log("SUCCESS");
  console.log(info);

} catch (err) {
  console.error("ERROR:");
  console.error(err);
}