var mongoose = require("mongoose");

var HistoryUpgradeSchema = new mongoose.Schema({
  userId: {
    type: String,
    require: true
  },
  upgradeId: {
    type: Number,
    require: true
  },
  upgradeType: {
    type: String,
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

var HistoryUpgrade = mongoose.model("HistoryUpgrade", HistoryUpgradeSchema);
module.exports = HistoryUpgrade;
