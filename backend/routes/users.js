const router = require("express").Router();

const usersController = require("../controllers/users");
const usersValidators = require("../middlewares/validators/users");
const fileUpload = require("../middlewares/upload/file-upload");

router.get("/", usersController.getUsers);

router.post("/signup", fileUpload.single("image"), usersValidators.signupValidator, usersController.signup);

router.post("/login", usersValidators.loginValidator, usersController.login);

module.exports = router;