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
        user: process.env.EMAIL_USER_VALUE,  // Your email (set as an environment variable)
        pass: process.env.EMAIL_PASS_VALUE,  // Your email password (set as an environment variable or use an App Password)
      },
    });

    // Set up the email data
    const mailOptions = {
      from: process.env.EMAIL_USER_VALUE,
      to: 'anantamanpowerservices@gmail.com', // Replace with your recipient email address
      subject: 'New Request Service Form Submission',
      html: `
      <p><strong>Company Name:</strong> ${companyName}</p>
      <p><strong>Contact Person:</strong> ${contactPerson}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Job Title:</strong> ${jobTitle}</p>
      <p><strong>Number of Positions:</strong> ${positions}</p>
      <p><strong>Job Description:</strong> ${jobDescription}</p>
      <p><strong>Additional Requirements:</strong> ${additionalRequirements}</p>
    `,    };

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
