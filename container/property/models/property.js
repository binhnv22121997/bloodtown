var mongoose = require("mongoose");

var PropertySchema = new mongoose.Schema({
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
  min_level: {
    type: Number,
    default: 0
  },
  time: {
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

var Property = mongoose.model("Property", PropertySchema);
module.exports = Property;
