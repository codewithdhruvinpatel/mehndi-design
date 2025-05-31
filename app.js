const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const app = express();

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.set('view engine', 'ejs');

// Render your homepagep
app.get('/', (req, res) => {
  res.render('index');
});

// POST route to handle form submission
app.post('/send-appointment', (req, res) => {
  const {
    fullName,
    email,
    phone,
    location,
    preferredDate,
    preferredTime,
    serviceType,
    message,
  } = req.body;

  // Create reusable transporter object using Gmail SMTP
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER, // Your Gmail address
      pass: process.env.GMAIL_PASS,    // Your Gmail App Password from Step 1
    },
  });

  let mailOptions = {
  from: `${fullName} <${email}>`,
  to: 'hennabydiyacontect@gmail.com',
  subject: 'New Appointment Request from Website',
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Appointment Details</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #fdf6f0; padding: 20px; margin: 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <tr>
          <td style="background-color: #a0522d; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
            <h2 style="color: #ffffff; margin: 0;">Henna By Diya</h2>
            <p style="color: #f9e5d0; margin: 5px 0 0;">New Appointment Request</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px;">
            <h3 style="color: #333;">Appointment Details</h3>
            <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
              <tr>
                <td style="border-bottom: 1px solid #ddd;"><strong>Name:</strong></td>
                <td style="border-bottom: 1px solid #ddd;">${fullName}</td>
              </tr>
              <tr>
                <td style="border-bottom: 1px solid #ddd;"><strong>Email:</strong></td>
                <td style="border-bottom: 1px solid #ddd;">${email}</td>
              </tr>
              <tr>
                <td style="border-bottom: 1px solid #ddd;"><strong>Phone:</strong></td>
                <td style="border-bottom: 1px solid #ddd;">${phone}</td>
              </tr>
              <tr>
                <td style="border-bottom: 1px solid #ddd;"><strong>Location:</strong></td>
                <td style="border-bottom: 1px solid #ddd;">${location}</td>
              </tr>
              <tr>
                <td style="border-bottom: 1px solid #ddd;"><strong>Preferred Date:</strong></td>
                <td style="border-bottom: 1px solid #ddd;">${preferredDate}</td>
              </tr>
              <tr>
                <td style="border-bottom: 1px solid #ddd;"><strong>Preferred Time:</strong></td>
                <td style="border-bottom: 1px solid #ddd;">${preferredTime}</td>
              </tr>
              <tr>
                <td style="border-bottom: 1px solid #ddd;"><strong>Service Type:</strong></td>
                <td style="border-bottom: 1px solid #ddd;">${serviceType}</td>
              </tr>
              <tr>
                <td style="vertical-align: top;"><strong>Message:</strong></td>
                <td>${message || 'N/A'}</td>
              </tr>
            </table>
            <p style="margin-top: 20px; font-size: 14px; color: #999;">You received this appointment request via the Henna By Diya website.</p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #a0522d; text-align: center; padding: 15px; color: #fff; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
            &copy; ${new Date().getFullYear()} Henna By Diya. All rights reserved.
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
};

  // Send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Failed to send email. Please try again later.');
    }
    console.log('Message sent: %s', info.messageId);
    res.send('Appointment submitted successfully!');
  });
});

app.listen(3000, () => console.log('Running at http://localhost:3000'));
