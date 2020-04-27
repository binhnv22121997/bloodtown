var { url } = require('../../config/connectDB');
var mongoose = require('mongoose');
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
var School = require('./models/school');
var docs = [
  {
    id: 1,
    name: "MATHS",
    btamin: -350,
    energy: -15,
    time: 45 * 60 * 1000,
    intelligence: 3,
    respect: 600
  },
  {
    id: 2,
    name: "MUSIC",
    btamin: -350,
    energy: -15,
    time: 45 * 60 * 1000,
    intelligence: 4,
    respect: 1200
  },
  {
    id: 3,
    name: "ART",
    btamin: -350,
    energy: -15,
    time: 45 * 60 * 1000,
    intelligence: 5,
    respect: 2400
  },
  {
    id: 4,
    name: "SCIENCE",
    btamin: -350,
    energy: -15,
    time: 45 * 60 * 1000,
    intelligence: 6,
    respect: 4800
  },
  {
    id: 5,
    name: "GEOGRAPHY",
    btamin: -350,
    energy: -15,
    time: 45 * 60 * 1000,
    intelligence: 7,
    respect: 6500
  },
  {
    id: 6,
    name: "INFORMATION TECHNOLOGY",
    btamin: -350,
    energy: -15,
    time: 45 * 60 * 1000,
    intelligence: 8,
    respect: 9500
  },
];
School.find({}, function (err, data) {
  if (!data[0]) {
    School.insertMany(docs);
    console.log("insert School successful !");
  } else {
    School.collection.drop();
    School.insertMany(docs);
    console.log("delete and insert School successful !");
  }
});