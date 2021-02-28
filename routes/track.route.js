let mongoose = require("mongoose"),
  express = require("express"),
  multer = require("multer"),
  router = express.Router();

const bucketName = 'Name of a bucket, e.g. my-bucket';
const storageClass = 'Name of a storage class, e.g. coldline';
const location = 'Name of a location, e.g. ASIA';

var multerStorage = multer.memoryStorage();
var upload = multer({
  storage: multerStorage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "audio/mpeg" ||
      file.mimetype === "audio/mp4" ||
      file.mimetype == "audio/mpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only MP3, MP4, or Mpeg format allowed!"));
    }
  },
});

let trackSchema = require("../Models/track");

// Imports the Google Cloud client library // Creates a client
const {Storage} = require('@google-cloud/storage');
const storage = new Storage();
const bucket = 
//Create new Wishlist item
router.post("/upload-track", upload.single("track"), (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");

  
});

//Get Wishlist
router.route("/get-wishlist").get((req, res) => {
  wishSchema.find((error, data) => {
    if (error) {
      return error;
    } else {
      res.json(data);
    }
  });
});
//Get wish by id
router.route("/get-wish/:id").get((req, res) => {
  wishSchema.findById(req.params.id, (error, data) => {
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
