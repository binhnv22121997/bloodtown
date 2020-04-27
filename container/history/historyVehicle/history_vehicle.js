var mongoose = require("mongoose");

var HistoryVehicleSchema = new mongoose.Schema({
  userId: {
    type: String,
    require: true
  },
  vehicleId: {
    type: Number,
    require: true
  },
  vehicleType: {
    type: String,
    require: true
  },
  upgradeType: {
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

var HistoryVehicle = mongoose.model("HistoryVehicle", HistoryVehicleSchema);
module.exports = HistoryVehicle;
