var { url } = require('../../config/connectDB');
var mongoose = require('mongoose');
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
var Property = require('./models/property');
var docs = [
  {
    id: 1,
    name: "SHOP",
    btamin: -3000,
    min_level: 1,
    time: 15 * 60 * 1000,
    income: 500
  },
  {
    id: 2,
    name: "CAFE",
    btamin: -6000,
    min_level: 2,
    time: 30 * 60 * 1000,
    income: 950
  },
  {
    id: 3,
    name: "HOTEL",
    btamin: -150000,
    min_level: 1,
    time: 15 * 60 * 1000,
    income: 500
  }
];
Property.find({}, function (err, data) {
  if (!data[0]) {
    Property.insertMany(docs);
    console.log("insert Property successful !");
  } else {
    Property.collection.drop();
    Property.insertMany(docs);
    console.log("delete and insert Property successful !");
  }
});