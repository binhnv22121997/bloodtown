var { url } = require('../../config/connectDB');
var mongoose = require('mongoose');
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
var Hospital = require('./models/hospital');
var docs = [
  {
    id: 1,
    name: "THERAPY",
    btamin: -250,
    time: 30 * 60 * 1000,
    health: 50
  },
  {
    id: 2,
    name: "FULL TREATMENT",
    btamin: -500,
    time: 60 * 60 * 1000,
    health: 100
  }
];
Hospital.find({}, function (err, data) {
  if (!data[0]) {
    Hospital.insertMany(docs);
    console.log("insert Hospital successful !");
  } else {
    Hospital.collection.drop();
    Hospital.insertMany(docs);
    console.log("delete and insert Hospital successful !");
  }
});