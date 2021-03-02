const mongoose = require("mongoose");
const express = require("express");
const Multer = require("multer");
const router = express.Router();
const { format } = require("util");
const mime = require("mime-types");

let trackSchema = require("../Models/track");

// Imports the Google Cloud client library // Creates a client
const { Storage } = require("@google-cloud/storage");
const storage = new Storage();
const bucket = storage.bucket("beatdealers.appspot.com");

//Multer upload audio
const upload = Multer({ storage: Multer.memoryStorage() });

//Multer upload image
const DIR = "./public/";
const fileStorage = Multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

//Upload audio and send back id
router.post("/upload-audio", upload.single("audio"), (req, res, next) => {
  const type = mime.lookup(req.file.originalname);

  // Create a new blob in the bucket and upload the file data.
  const blob = bucket.file(`${req.body.title}.${mime.extensions[type][0]}`);
  const blobStream = blob.createWriteStream({
    resumable: true,
    contentType: type,
  });
  blobStream.on("error", (err) => {
    next(err);
  });

  blobStream.on("finish", () => {
    const savedName = `https://storage.googleapis.com/beatdealers.appspot.com/${blob.name}`;
    res.status(201).json({
      message: "New Track published successfully",
      newAudio: savedName
    });
  });

  blobStream.end(req.file.buffer);
});

//Upload image, Create new track
router.post("/upload-track", upload.single("image"), (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const track = new trackSchema({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    image: url + "/public/",
    url: req.body.url,
    plays: 0,
    likes: 0,
    downloads: 0,
    created: new Date(),
  });
  track
    .save()
    .then((result) => {
      res.status(201).json({
        message: "New Track published successfully",
        newTrack: {
          _id: result._id,
          title: result.title,
          description: result.description,
          price: result.price,
          image: url + "/public/",
          url: req.body.url,
          plays: 0,
          likes: 0,
          downloads: 0,
          created: new Date(),
        },
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: error,
      });
    });
});

//Get Wishlist
router.route("/get-tracklist").get((req, res) => {
  trackSchema.find((error, data) => {
    if (error) {
      return error;
    } else {
      res.json(data);
    }
  });
});

//Get Track including data
router.route("/get-track").get((req, res) => {
  trackSchema.find((error, data) => {
    if (error) {
      return error;
    } else {
      res.json(data);
    }
  });
});

//Get track by id
router.route("/get-track/:id").get((req, res) => {
  trackSchema.findById(req.params.id, (error, data) => {
    if (error) {
      return error;
    } else {
      res.json(data);
    }
  });
});
//update wish by id
router.route("/edit-wish/:id").put((req, res) => {
  wishSchema.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (error, data) => {
      if (error) {
        return error;
      } else {
        res.json(data);
        console.log("Wish updated successfully !");
      }
    }
  );
});
//Delete wish by id
router.route("/delete-wish/:id").delete((req, res) => {
  wishSchema.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return error;
    } else {
      res.status(200).json({
        msg: data,
      });
      console.log("Wish deleted successfully !");
    }
  });
});
module.exports = router;
