var mongoose = require("mongoose");

var PlaneSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    default: ''
  },
  btamin: {
    type: Number,
    default: 0
  },
  btamin_sell: {
    type: Number,
    default: 0
  },
  min_level: {
    type: Number,
    default: 0
  },
  speed: {
    type: Number,
    default: 0
  },
  upgrade_speed: [{
    type: Number,
    default: 0
  }],
  upgrade_speed_btamin: [{
    type: Number,
    default: 0
  }],
  acceleration: {
    type: Number,
    default: 0
  },
  upgrade_acceleration: [{
    type: Number,
    default: 0
  }],
  upgrade_acceleration_btamin: [{
    type: Number,
    default: 0
  }],
  stability: {
    type: Number,
    default: 0
  },
  upgrade_stability: [{
    type: Number,
    default: 0
  }],
  upgrade_stability_btamin: [{
    type: Number,
    default: 0
  }],
  type: {
    type: String,
    default: 'Planes'
  }
}, {
  versionKey: false
});

var Plane = mongoose.model("Plane", PlaneSchema);
module.exports = Plane;