// Import required modules
const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Extract form data from the request body
    const { name, phone, email, message } = req.body;

    // Create a transporter for nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',  // Replace with your email service (Gmail, Yahoo, etc.)
      auth: {
        user: process.env.EMAIL_USER,  // Your email (set as an environment variable)
        pass: process.env.EMAIL_PASS,  // Your email password (set as an environment variable or use an App Password)
      },
    });

    // Set up the email data
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'anantamanpowerservices@gmail.com', // Replace with your recipient email address
      subject: 'Contact Form Submission',
      text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nMessage: ${message}`,
    };

    try {
      // Send the email
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
      console.error('Error occurred:', error);
      return res.status(500).json({ error: 'Failed to send email.' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
