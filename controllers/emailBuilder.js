const { StatusCodes } = require("http-status-codes");
const { createTransport } = require("nodemailer");
const { BadRequestError } = require("../errors");

const emailVideo = async (req, res) => {
  if (!req.body.email || !req.body.jsonLink) {
    throw new BadRequestError("Please provide email and jsonLink");
  }

  const transport = createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
      user: "godsonhm3@gmail.com",
      pass: process.env.BREVO_API_KEY,
    },
  });

  const mailOptions = {
    from: '"ScreenTalkMaster" <godsonhm3@gmail.com>',
    to: `${req.body.email}`,
    subject: "Exclusive Help Video for You",
    html: `<body>
    <div style="text-align: center; display: flex; align-items:center; justify-content: center">
        <img src="https://res.cloudinary.com/dikeogwu1/image/upload/v1701431905/HelpMeOut%20Chrome%20Extension/main-icon-xl_ac3gka.png" alt="ScreenTalkMaster Brand Logo" style="max-width: 80px; margin-bottom: 20px;">
        <h2 style="margin-left: 10px;">ScreenTalkMaster</h2>
    </div>
    <h2>Hello dear,</h2>
    <p>We hope this message finds you well.</p>
    <p>It is our pleasure to share an exclusive help video with you. This request comes from <strong>${req.user.firstName} ${req.user.lastName}</strong>, who values your time and experience.</p>
    <p>ScreenTalkMaster is a powerful tool designed to create informative videos, assisting users in navigating through various tasks on a website with ease.</p>
    <p>Please take a moment to view the personalized help video that was created for you by <strong>${req.user.firstName} ${req.user.lastName}</strong>:</p>
    <a href="https://screentalkmaster.netlify.app/ready/${req.body.jsonLink}" target="_blank" rel="noopener noreferrer">
        <button style="background-color: #007BFF; color: #ffffff; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
            Open Video
        </button>
    </a>
    <p>This video is a glimpse into the capabilities of ScreenTalkMaster. To fully unlock its potential, we invite you to sign up for a ScreenTalkMaster account:</p>
    <a href="https://screentalkmaster.netlify.app" target="_blank" rel="noopener noreferrer">
        <button style="background-color: #28a745; color: #ffffff; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
            Sign Up Now
        </button>
    </a>
    <p>Signing up will give you access to our powerful tool designed to create informative videos, assisting friends and family in navigating through various tasks on a website with ease. If you have any questions or need assistance, don't hesitate to reach out. I look forward to welcoming you to the ScreenTalkMaster community!</p>
    <p>Best regards,</p>
    <p>The ScreenTalkMaster Team</p>
  </body>`,
  };

  let info = await transport.sendMail(mailOptions);

  res.status(StatusCodes.OK).json(info.response);
};

module.exports = { emailVideo };
