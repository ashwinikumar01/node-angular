const mongoose = require("mongoose");

const auctionSchema = mongoose.Schema({
  auctionItemTitle: { type: String, required: true },
  auctionItemContent: { type: String, required: true },
  auctionItemImagePath: { type: String, required: true },
  auctionItemPrice: { type: Number, required: true },
});

module.exports = mongoose.model("Auction", auctionSchema);
