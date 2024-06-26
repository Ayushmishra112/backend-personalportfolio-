require('dotenv').config({ path: './auth.env' });

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const router = express.Router();
app.use(cors());
app.use(express.json());
app.use("/", router);

console.log(`Email User: ${process.env.EMAIL_USER}`);
console.log(`Email Pass: ${process.env.EMAIL_PASS}`);

// if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
//   console.log("Environment variables loaded successfully");
// } else {
//   console.log("Failed to load environment variables");
// }

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const contactEmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log("Nodemailer error:", error);
  } else {
    console.log("Ready to Send");
  }
});

router.post("/contact", (req, res) => {
  const { firstName, lastName, email, message, phone } = req.body;
  const mail = {
    from: `${firstName} ${lastName}`,
    to: process.env.EMAIL_USER,
    subject: "Contact Form Submission - Portfolio",
    html: `<p>Name: ${firstName} ${lastName}</p>
           <p>Email: ${email}</p>
           <p>Phone: ${phone}</p>
           <p>Message: ${message}</p>`,
  };

  contactEmail.sendMail(mail, (error) => {
    if (error) {
      console.error("Error sending email:", error);
      res.json({ code: 500, status: "Message Not Sent", error });
    } else {
      res.json({ code: 200, status: "Message Sent" });
    }
  });
});
