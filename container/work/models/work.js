var mongoose = require("mongoose");

var WorkSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true
  },
  name: {
    type: String,
    default: ''
  },
  energy: {
    type: Number,
    default: 0
  },
  health: {
    type: Number,
    default: 0
  },
  time: {
    type: Number,
    default: 0
  },
  respect: {
    type: Number,
    default: 0
  },
  income: {
    type: Number,
    default: 0
  }
}, {
  versionKey: false
});

var Work = mongoose.model("Work", WorkSchema);
module.exports = Work;