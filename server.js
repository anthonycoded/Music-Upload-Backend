let express = require("express");
let mongoose = require("mongoose");
let cors = require("cors");
let bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// Express Route
const trackRoute = require("./routes/track.route");
const audioRoute = require("./routes/audio.route");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/public", express.static("public"));
app.use("/tracks", trackRoute);
app.use("/audio", audioRoute);

// 404 Error
app.use((req, res, next) => {
  res.status(404);
});
app.use = (err, req, res, next) => {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
};

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

//connect to MongoDB Atlas
mongoose
  .connect(
    "mongodb+srv://admin:2swisshype@cluster0.uxrqf.mongodb.net/beats?retryWrites=true&w=majority",
    { useNewUrlParser: true },
    { useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas!");
  })
  .catch((error) => {
    console.log("Unable to connect to MongoDB Atlas!");
    console.error(error);
  });
