const fs = require("fs");
const path = require("path");

const HttpError = require("../models/error");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");

exports.getPlaceById = async (req, res, next) => {
  const { placeId } = req.params;

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Could not find a place with the given placeId.",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError("No place found!", 404);
    return next(error);
  }

  res.json({ place: place });
};

exports.getPlacesByUserId = async (req, res, next) => {
  const { userId } = req.params;

  let places;

  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      "No places were found with the given userId.",
      500
    );
    return next(error);
  }

  if (!places) {
    const error = new HttpError(
      "No places were found with the given userId.",
      404
    );
    return next(error);
  }

  res.json({ places });
};

exports.createPlace = async (req, res, next) => {
  const { title, description, address } = req.body;
  const { userId } = req.userData;
  const image = req.file.filename;

  let coordinates;

  try {
    coordinates = await getCoordsForAddress(address);
  } catch (err) {
    const error = new HttpError("Address not found! Please try again.", 500);
    return next(error);
  }

  const place = new Place({
    title,
    description,
    image,
    address,
    location: coordinates,
    creator: userId
  });

  let user;

  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError("Could not find user.", 500);
    return next(error);
  }

  let createdPlace;

  try {
    user.places.push(place._id);
    await user.save();
    createdPlace = await place.save();
  } catch (err) {
    const error = new HttpError("Creating a new place failed.", 500);
    return next(error);
  }

  res.status(201).json({
    message: "Place created!",
    place: createdPlace
  });
};

exports.updatePlace = async (req, res, next) => {
  const { placeId } = req.params;
  const { title, description } = req.body;
  const { userId } = req.userData;

  let foundPlace;

  try {
    foundPlace = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Could not find a place with the given placeId",
      500
    );
    return next(error);
  }

  if (!foundPlace) {
    return next(new HttpError("Place not found!", 404));
  }

  if (foundPlace.creator.toString() !== userId) {
    return next(new HttpError("Unauthorized!", 401));
  }

  foundPlace.title = title;
  foundPlace.description = description;
  try {
    await foundPlace.save();
  } catch (err) {
    const error = new HttpError("Could not save place.", 500);
    return next(error);
  }

  res.status(200).json({ message: "Updated place!", place: foundPlace });
};

exports.deletePlace = async (req, res, next) => {
  const { placeId } = req.params;
  const { userId } = req.userData;

  let foundPlace;

  try {
    foundPlace = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Could not find a place with the given placeId.",
      500
    );
    return next(error);
  }

  if (!foundPlace) {
    return next(new HttpError("Place not found!", 404));
  }

  if (foundPlace.creator.toString() !== userId) {
    return next(new HttpError("Unauthorized!", 401));
  }

  let user;

  try {
    user = await User.findOne({ places: { $in: [placeId] } });
  } catch (err) {
    const error = new HttpError(
      "Could not find user with the given placeId.",
      500
    );
    return next(error);
  }

  fs.unlink(
    path.join(__dirname, "..", "public", "images", foundPlace.image),
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );

  try {
    user.places = user.places.filter((p) => p.toString() !== placeId);
    await user.save();
    foundPlace.remove();
  } catch (err) {
    const error = new HttpError(
      "Could not delete place with the given placeId.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted place!" });
};
