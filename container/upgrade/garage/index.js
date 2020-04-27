var { url } = require('../../../config/connectDB');
var mongoose = require('mongoose');
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
var Garage = require('./models/garage');
var docs = [
  {
    id: 1,
    btamin: -5000,
    respect: 600,
    max_vehicles: 1,
    min_level: 1
  },
  {
    id: 2,
    btamin: -10000,
    respect: 1200,
    max_vehicles: 2,
    min_level: 2
  },
  {
    id: 3,
    btamin: -20000,
    respect: 2400,
    max_vehicles: 3,
    min_level: 3
  }
];
Garage.find({}, function (err, data) {
  if (!data[0]) {
    Garage.insertMany(docs);
    console.log("insert Garage successful !");
  } else {
    Garage.collection.drop();
    Garage.insertMany(docs);
    console.log("delete and insert Garage successful !");
  }
});