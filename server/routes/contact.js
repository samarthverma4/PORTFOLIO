const express = require('express');
const nodemailer = require('nodemailer');
const { RateLimiterMemory } = require('rate-limiter-flexible');

const router = express.Router();

// Rate limiting for contact form
const rateLimiter = new RateLimiterMemory({
  keyGenerator: (req) => req.ip,
  points: 3, // Number of requests
  duration: 3600, // Per 1 hour
});

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// POST /api/contact - Send contact form
router.post('/', async (req, res) => {
  try {
    // Rate limiting
    await rateLimiter.consume(req.ip);

    const { name, email, subject, message } = req.body;

    // Input validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    if (message.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Message too long (max 1000 characters)'
      });
    }

    // Send email if configuration exists
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = createTransporter();
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
        subject: `Portfolio Contact: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><small>Sent from Portfolio Contact Form</small></p>
        `,
        replyTo: email
      };

      await transporter.sendMail(mailOptions);
    }

    // Log contact submission (in production, you might save to database)
    console.log('Contact form submission:', {
      name,
      email,
      subject,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Thank you for your message! I\'ll get back to you soon.'
    });

  } catch (rateLimiterError) {
    if (rateLimiterError.remainingHits !== undefined) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.'
      });
    }

    console.error('Contact form error:', rateLimiterError);
    res.status(500).json({
      success: false,
      message: 'There was an error sending your message. Please try again.'
    });
  }
});

// GET /api/contact/info - Get contact information
router.get('/info', (req, res) => {
  res.json({
    email: 'rajeevnikky.15@gmail.com',
    phone: '+91 82732 85234',
    location: 'Mathura, UP, India',
    linkedin: 'linkedin.com/in/sam444',
    github: 'github.com/samarthverma',
    availability: 'Open for work'
  });
});

module.exports = router;