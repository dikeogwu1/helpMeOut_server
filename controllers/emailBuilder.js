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
    subject: "Help video made for you",
    html: `<body>
    <h2>We're asked to send you this help video by: ${req.user.firstName} ${req.user.lastName}</h2>
    <br/>
    <p>ScreenTalkMaster is used for create a help videos of how to get something done on a website.</p>
    <br/>
    <a href="https://screentalkmaster.netlify.app/ready/${req.body.jsonLink}" target="_blank" rel="noopener noreferrer">
    <button>
     Open Video
    </button>
    </a>
    </body>`,
  };

  let info = await transport.sendMail(mailOptions);

  res.status(StatusCodes.OK).json(info.response);
};

module.exports = { emailVideo };
