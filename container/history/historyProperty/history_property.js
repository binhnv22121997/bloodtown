var mongoose = require("mongoose");

var HistoryPropertySchema = new mongoose.Schema({
  userId: {
    type: String,
    require: true
  },
  propertyId: {
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

var HistoryProperty = mongoose.model("HistoryProperty", HistoryPropertySchema);
module.exports = HistoryProperty;
