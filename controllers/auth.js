const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
// @desc Register user
// @route POST /api/v1/auth/register
// @access public

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const user = await User.create({ name, email, password, role });
  sendTokenResponse(user, 200, res);
});
// @desc Login user
// @route GET /api/v1/auth/register
// @access public

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  //validate
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  sendTokenResponse(user, 200, res);
});

// @desc Get current logged user
// @route POST /api/v1/auth/me
// @access Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});
// @desc forgot password
// @route POST /api/v1/auth/forgotassword
// @access Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorResponse("There is no user with that email", 404));
  }

  //get reset token

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  //create reset url

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/resetpassword/${resetToken}`;
  const message = `you are receiving this email because you(or someone else ) has requested the reset of a password. Please make a PUT reques to : \n\n ${resetUrl}`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });
    res.status(200).json({
      success: true,
      data: "Email sent",
    });
  } catch (error) {
    console.log(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpired = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse("Email could not be sent", 500));
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

//get token from model, create cookie and send reponse

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expire: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};
