const jwt = require("jsonwebtoken");

const HttpError = require("../../models/error");

const checkToken = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_KEY);

    req.userData = { userId: decodedToken.userId };

    next();
  } catch (err) {
    return next(new HttpError("Unauthorized!", 403));
  }
};

module.exports = checkToken;
