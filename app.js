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

  // Compose email options
  let mailOptions = {
    from:  `${fullName} <${email}>`, // sender address
    to: 'hennabydiyacontect@gmail.com', // receiver email (Diya's email)
    subject: 'New Appointment Request from Website',
    html: `
      <h3>Appointment Details</h3>
      <ul>
        <li><strong>Name:</strong> ${fullName}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Phone:</strong> ${phone}</li>
        <li><strong>Location:</strong> ${location}</li>
        <li><strong>Preferred Date:</strong> ${preferredDate}</li>
        <li><strong>Preferred Time:</strong> ${preferredTime}</li>
        <li><strong>Service Type:</strong> ${serviceType}</li>
        <li><strong>Message:</strong> ${message}</li>
      </ul>
    `,
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
