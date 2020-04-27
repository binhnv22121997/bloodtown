var { url } = require('../../config/connectDB');
var mongoose = require('mongoose');
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
var Work = require('./models/work');
var docs = [
  {
    id: 1,
    name: "PART-TIME JOB",
    energy: -40,
    health: -25,
    time: 6 * 60 * 60 * 1000,
    respect: 600,
    income: 600
  },
  {
    id: 2,
    name: "FULL-TIME JOB",
    energy: -60,
    health: -40,
    time: 8 * 60 * 60 * 1000,
    respect: 600,
    income: 3200
  },
  {
    id: 3,
    name: "PROJECT",
    energy: -80,
    health: -50,
    time: 16 * 60 * 60 * 1000,
    respect: 600,
    income: 5300
  },
  {
    id: 4,
    name: "SEASONAL WORK",
    energy: -100,
    health: -60,
    time: 24 * 60 * 60 * 1000,
    respect: 600,
    income: 8100
  },
];
Work.find({}, function (err, data) {
  if (!data[0]) {
    Work.insertMany(docs);
    console.log("insert Work successful !");
  } else {
    Work.collection.drop();
    Work.insertMany(docs);
    console.log("delete and insert Work successful !");
  }
});