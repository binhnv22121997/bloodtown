var mongoose = require("mongoose");

var HospitalSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true
  },
  name: {
    type: String,
    default: ''
  },
  btamin: {
    type: Number,
    default: 0
  },
  time: {
    type: Number,
    default: 0
  },
  health: {
    type: Number,
    default: 0
  }
}, {
  versionKey: false
});

var Hospital = mongoose.model("Hospital", HospitalSchema);
module.exports = Hospital;