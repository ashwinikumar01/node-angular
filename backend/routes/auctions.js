const express = require("express");
const multer = require("multer");

const router = express.Router();

const Auction = require("../models/auction");

//Checking if image is there or not
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

//Image file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid file type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const extension = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + extension);
  },
});

// Creating a new auction item
router.post(
  "",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const auction = new Auction({
      auctionItemTitle: req.body.auctionItemTitle,
      auctionItemContent: req.body.auctionItemContent,
      auctionItemImagePath: url + "/images/" + req.file.filename,
    });
    auction
      .save()
      .then((createdAuctionList) => {
        res.status(200).json({
          message: "Auction Item added successfully!",
          auctionItemList: {
            id: createdAuctionList._id, // _id from MongoDb
            ...createdAuctionList,
          },
        });
      })
      .catch((eror) => {
        res.status(500).json({
          message: "Creating an auction item failed!",
        });
      });
  }
);

// Updating A Single Auction Item & req.params.id is given by express
router.put(
  ":/id",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let auctionItemImagePath = req.body.auctionItemImagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      auctionItemImagePath = url + "/images/" + req.file.filename;
    }
    const auction = new Auction({
      _id: req.body.id, //we are getting (_id) from mongoDB because we once posted it on db
      auctionItemTitle: req.body.auctionItemTitle,
      auctionItemContent: req.body.auctionItemContent,
      auctionItemImagePath: req.body.auctionItemImagePath,
    });
    console.log(auction);
    Auction.updateOne({ _id: req.params.id }, auction).then((result) => {
      console.log(result);
      res.status(200).json({ message: "Auction Item Updated Successfully!" });
    });
  }
);

//Getting all Auctions List
router.get("", (req, res, next) => {
  Auction.find().then((documents) => {
    res.status(200).json({
      message: "Auctions list fetched successfully!",
      auctionItemsList: documents,
    });
  });
});

//Getting a Single Auction Item & req.params.id is given by express
router.get("/:id", (req, res, next) => {
  Auction.findById(req.params.id).then((singleAuctionItem) => {
    if (singleAuctionItem) {
      res.status(200).json(singleAuctionItem);
    } else {
      res.status(404).json({ message: "Auction Item Not Found!" });
    }
  });
});

// Deleting a single auction item
// _id == name in MongoDB & req.params.id is given by express
router.delete("/:id", (req, res, next) => {
  Auction.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Auction Item deleted!" });
  });
});

module.exports = router;
