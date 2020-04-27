var mongoose = require("mongoose");

var HistoryUserSchema = new mongoose.Schema({
  userId: {
    type: String,
    require: true
  },
  workId: {
    type: Number,
    require: true
  },
  workType: {
    type: String
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

var HistoryUser = mongoose.model("HistoryUser", HistoryUserSchema);
module.exports = HistoryUser;
