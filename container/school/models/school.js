var mongoose = require("mongoose");

var SchoolSchema = new mongoose.Schema({
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
  energy: {
    type: Number,
    default: 0
  },
  time: {
    type: Number,
    default: 0
  },
  intelligence: {
    type: Number,
    default: 0
  },
  respect: {
    type: Number,
    default: 0
  }
}, {
  versionKey: false
});

var School = mongoose.model("School", SchoolSchema);
module.exports = School;