var { url } = require('../../../config/connectDB');
var mongoose = require('mongoose');
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
var Home = require('./models/home');
var docs = [
  {
    id: 1,
    btamin: 0,
    respect: 300,
    max_pets: 0,
    min_level: 1
  },
  {
    id: 2,
    btamin: -10000,
    respect: 600,
    max_pets: 1,
    min_level: 1
  },
  {
    id: 3,
    btamin: -10000,
    respect: 1200,
    max_pets: 2,
    min_level: 2
  },
  {
    id: 4,
    btamin: -20000,
    respect: 2400,
    max_pets: 3,
    min_level: 3
  },
  {
    id: 5,
    btamin: -30000,
    respect: 4800,
    max_pets: 4,
    min_level: 4
  },
  {
    id: 6,
    btamin: -40000,
    respect: 9600,
    max_pets: 5,
    min_level: 5
  }
];
Home.find({}, function (err, data) {
  if (!data[0]) {
    Home.insertMany(docs);
    console.log("insert Home successful !");
  } else {
    Home.collection.drop();
    Home.insertMany(docs);
    console.log("delete and insert Home successful !");
  }
});