const { body, validationResult } = require("express-validator");
const HttpError = require("../../models/error");

exports.loginValidator = [
  body("email")
    .normalizeEmail()
    .isEmail()
    .withMessage("Please enter a valid email.")
    .not()
    .isEmpty(),
  body("password", "Password is missing.")
    .trim()
    .not()
    .isEmpty()
    .custom((value, {req}) => {
      const { password } = req.body;
      
      if (password.length < 5 && password.length > 0) {
        throw new Error("Password is incorrect.");
      } else {
        return true;
      }
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    let errorsArray = [];

    if (!errors.isEmpty()) {
      for (const err of errors.array()) {
        errorsArray.push(err.msg);
      }
      
      return next(new HttpError(errorsArray, 422));
    }

    next();
  }
];

exports.signupValidator = [
  body("email")
    .normalizeEmail()
    .isEmail()
    .withMessage("Please enter a valid email.")
    .not()
    .isEmpty(),
  body("password", "Password is missing.")
    .trim()
    .not()
    .isEmpty()
    .custom((value, {req}) => {
      const { password } = req.body;
      
      if (password.length < 5 && password.length > 0) {
        throw new Error("Password should be at least 5 characters long.");
      } else {
        return true;
      }
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    let errorsArray = [];

    if (!errors.isEmpty()) {
      for (const err of errors.array()) {
        errorsArray.push(err.msg);
      }
      
      return next(new HttpError(errorsArray, 422));
    }

    next();
  }
];