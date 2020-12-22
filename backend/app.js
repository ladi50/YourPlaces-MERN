const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places");
const usersRoutes = require("./routes/users");
const HttpError = require("./models/error");

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", [
    "Content-Type",
    "Authorization"
  ]);
  res.setHeader("Access-Control-Allow-Methods", "*");
  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Page not found!", 404);
  next(error);
});

app.use((err, req, res, next) => {
  if (req.file) {
    fs.unlink(path.join(__dirname, req.file.path), (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
  if (res.headerSent) {
    return next(err);
  }
  const status = err.status || 500;
  const message = err.message || "An error occured!";
  res.status(status).json({ message });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@deployment-db.ws1w7.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }
  )
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => {
    throw new Error(err);
  });
