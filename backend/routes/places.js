const router = require("express").Router();

const placesController = require("../controllers/places");
const placesValidators = require("../middlewares/validators/places");
const fileUpload = require("../middlewares/upload/file-upload");
const checkToken = require("../middlewares/token/jwt-verify");

router.get("/:placeId", placesController.getPlaceById);

router.get("/user/:userId", placesController.getPlacesByUserId);

router.use(checkToken);

router.post("/", fileUpload.single("image"), placesValidators.createPlaceValidator, placesController.createPlace);

router.patch("/:placeId", placesValidators.updatePlaceValidator, placesController.updatePlace);

router.delete("/:placeId", placesController.deletePlace);

module.exports = router;