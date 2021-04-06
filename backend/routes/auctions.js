const express = require("express");

const AuctionController = require("../controllers/auctions");

const extractFile = require("../middleware/file");

const router = express.Router();

router.post("", extractFile, AuctionController.createAuctionItem);

router.put(":/id", extractFile, AuctionController.updateAuctionItem);

router.get("", AuctionController.getAllAuctionItems);

router.get("/:id", AuctionController.getSingleAuctionItem);

router.delete("/:id", AuctionController.deleteAuctionItem);

module.exports = router;
