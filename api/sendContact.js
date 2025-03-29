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
        user: process.env.EMAIL_USER_VALUE,  // Your email (set as an environment variable)
        pass: process.env.EMAIL_PASS_VALUE,  // Your email password (set as an environment variable or use an App Password)
      },
    });

    // Set up the email data
    const mailOptions = {
      from: process.env.EMAIL_USER_VALUE,
      to: 'info@anantamentors.in', // Replace with your recipient email address
      subject: 'Contact Form Submission',
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
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
