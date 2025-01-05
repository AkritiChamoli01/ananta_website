// Import required modules
const nodemailer = require('nodemailer');
const formidable = require('formidable');
const fs = require('fs');

export const config = {
  api: {
    bodyParser: false, // Disables default body parser to handle multipart form data
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return res.status(500).json({ error: 'Error parsing form data.' });
      }

      const {
        companyName,
        contactPerson,
        phone,
        email,
        jobTitle,
        positions,
        jobDescription,
        additionalRequirements,
      } = fields;

      const resume = files.resume;

      // Create a transporter for nodemailer
      const transporter = nodemailer.createTransport({
        service: 'gmail', // Replace with your email service
        auth: {
          user: process.env.EMAIL_USER_VALUE, // Your email (set as an environment variable)
          pass: process.env.EMAIL_PASS_VALUE, // Your email password (set as an environment variable or use an App Password)
        },
      });

      // Read the uploaded resume file
      let attachment;
      if (resume) {
        attachment = {
          filename: resume.originalFilename,
          path: resume.filepath,
        };
      }

      // Set up the email data
      const mailOptions = {
        from: process.env.EMAIL_USER_VALUE,
        to: 'anantamanpowerservices@gmail.com', // Replace with your recipient email address
        subject: 'New Career Form Submission',
        html: `
          <p><strong>Company Name:</strong> ${companyName}</p>
          <p><strong>Contact Person:</strong> ${contactPerson}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Job Title:</strong> ${jobTitle}</p>
          <p><strong>Number of Positions:</strong> ${positions}</p>
          <p><strong>Job Description:</strong> ${jobDescription}</p>
          <p><strong>Additional Requirements:</strong> ${additionalRequirements}</p>
        `,
        attachments: attachment ? [attachment] : [],
      };

      try {
        // Send the email
        await transporter.sendMail(mailOptions);

        // Delete the temporary file after sending email
        if (resume) {
          fs.unlinkSync(resume.filepath);
        }

        return res.status(200).json({ message: 'Email sent successfully!' });
      } catch (error) {
        console.error('Error occurred while sending email:', error);
        return res.status(500).json({ error: 'Failed to send email.' });
      }
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
