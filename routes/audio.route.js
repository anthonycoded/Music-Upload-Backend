const mongoose = require("mongoose");
const express = require("express");
const Multer = require("multer");
const router = express.Router();
const { format } = require("util");
const mime = require("mime-types");


// Imports the Google Cloud client library // Creates a client
const { Storage } = require("@google-cloud/storage");
const storage = new Storage();
const bucket = storage.bucket("beatdealers.appspot.com");

//Multer upload audio
const upload = Multer({ storage: Multer.memoryStorage() });


router.post("/upload-audio", upload.single("audio"), (req, res, next) => {
  const type = mime.lookup(req.file.originalname);

  // Create a new blob in the bucket and upload the file data.
  const blob = bucket.file(
    `${req.file.originalname}.${mime.extensions[type][0]}`
  );
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
      newAudio: savedName,
    });
  });

  blobStream.end(req.file.buffer);
});
module.exports = router;