let mongoose = require("mongoose"),
  express = require("express"),
  multer = require("multer"),
  router = express.Router();
const DIR = "./public/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split("").join("-");
    cb(null, uuid + "-" + fileName);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
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
  },
});

let wishSchema = require("../Models/Wish");

//Create new Wishlist item
router.post("/new-wish", upload.single("image"), (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");

  const wish = new wishSchema({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    image: url + "/public/" + req.file.filename,
    source: req.body.source,
    reservedBy: req.body.reservedBy,
    amazonUrl: req.body.amazonUrl,
    walmartUrl: req.body.walmartUrl,
    otherUrl: req.body.otherUrl,
  });
  wish
    .save()
    .then((result) => {
      res.status(201).json({
        message: "New wish created successfully",
        wishCreated: {
          _id: result._id,
          image: result.image,
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
