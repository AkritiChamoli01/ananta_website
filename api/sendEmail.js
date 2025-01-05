// Import required modules
const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Extract form data from the request body
    const { companyName, contactPerson, phone, email, jobTitle, positions, jobDescription, additionalRequirements } = req.body;

    // Create a transporter for nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',  // Replace with your email service (Gmail, Yahoo, etc.)
      auth: {
        user: "savitarawat036@gmail.com",  // Your email (set as an environment variable)
        pass: "fawk fjln odee hdmh",  // Your email password (set as an environment variable or use an App Password)
      },
    });

    // Set up the email data
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'anantamanpowerservices@gmail.com', // Replace with your recipient email address
      subject: 'New Request Service Form Submission',
      text: `Company Name: ${companyName}\nContact Person: ${contactPerson}\nPhone: ${phone}\nEmail: ${email}\nJob Title: ${jobTitle}\nNumber of Positions: ${positions}\nJob Description: ${jobDescription}\nAdditional Requirements: ${additionalRequirements}`,
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
