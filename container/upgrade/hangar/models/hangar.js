var mongoose = require("mongoose");

var HangarSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true
  },
  btamin: {
    type: Number,
    default: 0
  },
  respect: {
    type: Number,
    default: 0
  },
  max_vehicles: {
    type: Number,
    default: 0
  },
  min_level: {
    type: Number,
    default: 0
  },
}, {
  versionKey: false
});

var Hangar = mongoose.model("Hangar", HangarSchema);
module.exports = Hangar;
