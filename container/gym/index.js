var { url } = require('../../config/connectDB');
var mongoose = require('mongoose');
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
var Gym = require('./models/gym');
var docs = [
  {
    id: 1,
    name: "STRETCHING",
    btamin: -150,
    energy: -10,
    time: 15 * 60 * 1000,
    health: 15,
    power: 0,
    agility: 5,
    endurance: 4,
    respect: 9500
  },
  {
    id: 2,
    name: "SHORT WORKOUT",
    btamin: -300,
    energy: -20,
    time: 30 * 60 * 1000,
    health: 30,
    power: 2,
    agility: 0,
    endurance: 1,
    respect: 9500
  },
  {
    id: 3,
    name: "NORMAL WORKOUT",
    btamin: -500,
    energy: -30,
    time: 60 * 60 * 1000,
    health: 45,
    power: 4,
    agility: 0,
    endurance: 2,
    respect: 9500
  },
  {
    id: 4,
    name: "FULL WORKOUT",
    btamin: -650,
    energy: -70,
    time: 2 * 60 * 60 * 1000,
    health: 80,
    power: 6,
    agility: 3,
    endurance: 4,
    respect: 9800
  }
];
Gym.find({}, function (err, data) {
  if (!data[0]) {
    Gym.insertMany(docs);
    console.log("insert Gym successful !");
  } else {
    Gym.collection.drop();
    Gym.insertMany(docs);
    console.log("delete and insert Gym successful !");
  }
});