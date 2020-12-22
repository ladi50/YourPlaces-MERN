const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/error");
const User = require("../models/user");

exports.getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError("No users found!", 500);
    return next(error);
  }

  res.status(200).json({ users });
};

exports.signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  const image = req.file.filename;

  let foundUser;
  let hashedPassword;

  try {
    foundUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError(
      "An error occured while searching for a user!",
      422
    );
    return next(error);
  }

  if (foundUser) {
    const error = new HttpError("Email already exists!", 422);
    return next(error);
  }

  try {
    hashedPassword = bcrypt.hashSync(password, 12);
  } catch (err) {
    const error = new HttpError("Something went wrong! Please try again.", 500);
    return next(error);
  }

  const user = new User({
    email,
    password: hashedPassword,
    name,
    image,
    places: []
  });

  let createdUser;

  try {
    createdUser = await user.save();
  } catch (err) {
    const error = new HttpError("Could not create user!", 500);
    return next(error);
  }

  let token;
  const jwtKey = process.env.JWT_KEY;

  try {
    token = jwt.sign(
      {
        userId: createdUser._id.toString(),
        email: createdUser.email,
        name: createdUser.name
      },
      jwtKey,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Could not create user!", 500);
    return next(error);
  }

  res.status(201).json({
    message: "Created user!",
    userId: createdUser._id.toString(),
    email: createdUser.email,
    token
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  let foundUser;

  try {
    foundUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError("Could not find user.", 422);
    return next(error);
  }

  const samePassword = bcrypt.compareSync(password, foundUser.password);

  if (!samePassword || !foundUser) {
    const error = new HttpError("Email or password is incorrect!", 403);
    return next(error);
  }

  let token;

  try {
    token = jwt.sign(
      {
        userId: foundUser._id.toString(),
        email: foundUser.email,
        name: foundUser.name
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Unable to log in! Please try again.", 500);
    return next(error);
  }

  res
    .status(200)
    .json({
      message: "User logged in successfully!",
      userId: foundUser._id.toString(),
      email: foundUser.email,
      token
    });
};
