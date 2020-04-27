var mongoose = require('mongoose');

var LevelSchema = new mongoose.Schema({
  level: {
    type: Number,
    unique: true,
    required: true
  },
  respect: {
    type: Number,
    unique: true,
    required: true
  }
}, {
  versionKey: false
});

var Level = mongoose.model('Level', LevelSchema);
module.exports = Level;