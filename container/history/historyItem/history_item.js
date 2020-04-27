var mongoose = require("mongoose");

var HistoryItemSchema = new mongoose.Schema({
  userId: {
    type: String,
    require: true
  },
  itemId: {
    type: Number,
    require: true
  },
  action: {
    type: String,
    require: true
  },
  data: {
    type: Object,
    default: null
  },
  success: {
    type: Boolean,
    require: true
  },
  message: {
    type: String
  },
  reqData: {
    type: Object,
    default: null
  },
  resData: {
    type: Object,
    default: null
  },
  createAt: {
    type: Number,
    default: Date.now()
  }
}, {
  versionKey: false
});

var HistoryItem = mongoose.model("HistoryItem", HistoryItemSchema);
module.exports = HistoryItem;
