const User = require("../models/User");
const { createTransport } = require("nodemailer");
const crypto = require("crypto");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const createHash = require("../utils/createHash");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.firstName }, token });
};
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }
  // compare password
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid credentials");
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.firstName }, token });
};

const getCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new CustomError.BadRequestError("Please provide valid email");
  }
  const user = await User.findOne({ email });

  if (user) {
    const passwordToken = crypto.randomBytes(70).toString("hex");
    // send email

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
      to: `${user.email}`,
      subject: "Reset Password",
      html: `<body>
      <div style="text-align: center; display: flex;  justify-content: center; align-items:center; margin-bottom: 20px;">
        <img src="https://res.cloudinary.com/dikeogwu1/image/upload/v1701431905/HelpMeOut%20Chrome%20Extension/main-icon-xl_ac3gka.png" alt="ScreenTalkMaster Brand Logo" style="width: 30px; height: 30px;">
        <h2 style="margin-left: 10px;">ScreenTalkMaster</h2>
    </div>

    <h2>Dear ${user.firstName},</h2>
    <p>Do you want to reset your password? If yes, click on the button below to reset your password.</p>
    <p>
    <a href="https://screentalkmaster.netlify.app/reset-password?token=${passwordToken}&email=${email}" target="_blank" rel="noopener noreferrer">
        <button style="background-color: #28a745; color: #ffffff; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
            Reset Password
        </button>
    </a></p>
    <p>Best regards,</p>
    <p>The ScreenTalkMaster Team</p>
  </body>`,
    };

    let info = await transport.sendMail(mailOptions);

    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    user.passwordToken = createHash(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: "Please check your email for reset password link" });
};

const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;
  if (!token || !email || !password) {
    throw new CustomError.BadRequestError("Please provide all values");
  }
  const user = await User.findOne({ email });

  if (user) {
    const currentDate = new Date();

    if (currentDate > user.passwordTokenExpirationDate) {
      throw new BadRequestError("Sorry! The link has expired");
    }

    if (
      user.passwordToken === createHash(token) &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      user.password = password;
      user.passwordToken = null;
      user.passwordTokenExpirationDate = null;
      await user.save();
    }
  }

  res.status(StatusCodes.OK).json({ msg: "reset password" });
};

module.exports = {
  register,
  login,
  getCurrentUser,
  forgotPassword,
  resetPassword,
};
