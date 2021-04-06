const mongoose = require("mongoose");

const auctionSchema = mongoose.Schema({
  auctionItemTitle: { type: String, required: true },
  auctionItemContent: { type: String, required: true },
  auctionImagePath: { type: String, required: true },
});

module.exports = mongoose.model("Auction", auctionSchema);
