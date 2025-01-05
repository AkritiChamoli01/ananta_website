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
        name,
        email,
        phone,
        address,
        message
      } = fields;

      // Debugging: Log the entire `files` object to understand its structure
      console.log('Files:', files);

      // Access the resume file (assuming it's an array, check its structure first)
      const resume = Array.isArray(files.resume) ? files.resume[0] : files.resume;
      console.log('Resume:', resume);

      // If resume file exists and has a valid file path, prepare attachment
      let attachment;
      if (resume && resume.filepath) {
        attachment = {
          filename: resume.originalFilename,
          path: resume.filepath,
        };
      }

      // Debugging: Log attachment details
      console.log('Attachment:', attachment);

      // Create a transporter for nodemailer
      const transporter = nodemailer.createTransport({
        service: 'gmail', // Replace with your email service
        auth: {
          user: process.env.EMAIL_USER_VALUE, // Your email (set as an environment variable)
          pass: process.env.EMAIL_PASS_VALUE, // Your email password (set as an environment variable or use an App Password)
        },
      });

      // Set up the email data
      const mailOptions = {
        from: process.env.EMAIL_USER_VALUE,
        to: 'anantamanpowerservices@gmail.com', // Replace with your recipient email address
        subject: 'New Career Form Submission',
        html: `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Address:</strong> ${address}</p>
          <p><strong>Message:</strong> ${message}</p>
        `,
        attachments: attachment ? [attachment] : [], // Attach the file only if available
      };

      try {
        // Send the email
        await transporter.sendMail(mailOptions);

        // Delete the temporary file after sending the email (if the file exists)
        if (resume && resume.filepath) {
          try {
            fs.unlinkSync(resume.filepath); // Only delete if the file path is defined
          } catch (deleteError) {
            console.error('Error deleting file:', deleteError);
          }
        }

        // Respond with success message
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
