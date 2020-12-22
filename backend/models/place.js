const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    minlength: 5
  },
  image: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  creator: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User"
  }
});

const Place = mongoose.model("Place", placeSchema);

module.exports = Place;
