const mongoose = require("mongoose");
const express = require("express");
const Multer = require("multer");
const router = express.Router();
const { format } = require("util");
const mime = require("mime-types");

let trackSchema = require("../Models/track");


//Multer Configurations
const DIR = "./public/";
const fileStorage = Multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase();
    cb(null, fileName);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "track") {
    if (
      file.mimetype === "audio/mp3" ||
      file.mimetype === "audio/mpga" ||
      file.mimetype === "audio/wav"
    ) {
      // check file type to be pdf, doc, or docx
      cb(null, true);
    } else {
      cb(null, false); // else fails
    }
  } else {
    if (
      file.mimetype == "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg, and.jpeg format allowed!"));
    }
  }
};

//Multer upload audio
const upload = Multer({ storage: fileStorage, fileFilter: fileFilter });


//Upload image, Create new track
router.post("/upload-track", upload.single("image"), (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const imageUrl = url + "/public/" + req.file.filename;
  const track = new trackSchema({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    image: imageUrl,
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
          image: result.image,
          url: req.body.url,
          plays: 0,
          likes: 0,
          downloads: 0,
          created: req.body.created,
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
