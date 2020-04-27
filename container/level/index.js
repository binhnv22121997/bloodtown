var { url } = require('../../config/connectDB');
var mongoose = require('mongoose');
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
var Level = require('./models/level');
var docs = [
  {
    "level": 1,
    "respect": 80
  },
  {
    "level": 2,
    "respect": 400
  },
  {
    "level": 3,
    "respect": 1000
  },
  {
    "level": 4,
    "respect": 3000
  },
  {
    "level": 5,
    "respect": 5000
  },
  {
    "level": 6,
    "respect": 10000
  },
  {
    "level": 7,
    "respect": 20000
  },
  {
    "level": 8,
    "respect": 30000
  },
  {
    "level": 9,
    "respect": 50000
  },
  {
    "level": 10,
    "respect": 100000
  }
];
Level.find({}, function (err, data) {
  if (!data[0]) {
    Level.insertMany(docs);
    console.log("insert Level successful !");
  } else {
    Level.collection.drop();
    Level.insertMany(docs);
    console.log("delete and insert Level successful !");
  }
});