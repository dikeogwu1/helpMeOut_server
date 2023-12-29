const { StatusCodes } = require("http-status-codes");
const { createTransport } = require("nodemailer");
const { BadRequestError } = require("../errors");

const sendSupportMsg = async (req, res) => {
  const { tittle, subject, message } = req.body;
  if (!tittle || !subject || !message) {
    throw new BadRequestError("Please provide all value");
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
    to: "fabianikem272@gmail.com",
    subject: "User support",
    html: `<body>
    <h2>${subject}</h2>
    <p><strong>${tittle}</strong></p>
    <p>${message}</p>
    <p>${message}</p>
    <p>This message came from the support page of ScreenTalkMaster (PWA).</p>
    <p>Sent by: <strong>${req.user.firstName} ${req.user.lastName}</strong></p>
  </body>`,
  };

  let info = await transport.sendMail(mailOptions);

  res.status(StatusCodes.OK).json(info.response);
};

module.exports = { sendSupportMsg };
