const { body, validationResult, Result } = require("express-validator");

const HttpError = require("../../models/error");

exports.createPlaceValidator = [
  body("title", "Title is missing.").trim().not().isEmpty(),
  body("description", "Description must be at least 5 characters long.")
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 5 }),
  body("address", "Address is missing.").trim().not().isEmpty(),
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

exports.updatePlaceValidator = [
  body("title", "Title is missing.").trim().not().isEmpty(),
  body("description", "Description must be at least 5 characters long.")
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 5 }),
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
