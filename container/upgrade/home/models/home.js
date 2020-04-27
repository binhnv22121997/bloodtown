var mongoose = require("mongoose");

var HomeSchema = new mongoose.Schema({
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
  max_pets: {
    type: Number,
    default: 0
  },
  min_level: {
    type: Number,
    default: 0
  }
}, {
  versionKey: false
});

var Home = mongoose.model("Home", HomeSchema);
module.exports = Home;
