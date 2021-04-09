const express = require("express");

const AuctionController = require("../controllers/auctions");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("", checkAuth, extractFile, AuctionController.createAuctionItem);

router.put("/:id", checkAuth, extractFile, AuctionController.updateAuctionItem);

router.get("", AuctionController.getAllAuctionItems);

router.get("/:id", AuctionController.getSingleAuctionItem);

router.delete("/:id", checkAuth, AuctionController.deleteAuctionItem);

module.exports = router;
