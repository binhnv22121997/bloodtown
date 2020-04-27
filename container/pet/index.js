var { url } = require('../../config/connectDB');
var mongoose = require('mongoose');
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
var Pet = require('./models/pet');
var docs = [
  {
    id: 1,
    name: "Hamster1",
    btamin: -50,
    btamin_sell: 25,
    min_level: 1,
    endurance: 0,
    intelligence: 0,
    power: 0,
    agility: 5,
    vip: "No",
    type: "PETS"
  },
  {
    id: 2,
    name: "Hamster2",
    btamin: -50,
    btamin_sell: 25,
    min_level: 1,
    endurance: 0,
    intelligence: 0,
    power: 0,
    agility: 5,
    vip: "No",
    type: "PETS"
  },
  {
    id: 3,
    name: "Hamster3",
    btamin: -50,
    btamin_sell: 25,
    min_level: 1,
    endurance: 0,
    intelligence: 0,
    power: 0,
    agility: 5,
    vip: "No",
    type: "PETS"
  },
  {
    id: 4,
    name: "Cat1",
    btamin: -50,
    btamin_sell: 25,
    min_level: 1,
    endurance: 0,
    intelligence: 0,
    power: 0,
    agility: 5,
    vip: "No",
    type: "PETS"
  },
  {
    id: 5,
    name: "Cat2",
    btamin: -50,
    btamin_sell: 25,
    min_level: 1,
    endurance: 0,
    intelligence: 0,
    power: 0,
    agility: 5,
    vip: "No",
    type: "PETS"
  },
  {
    id: 6,
    name: "Cat3",
    btamin: -50,
    btamin_sell: 25,
    min_level: 1,
    endurance: 0,
    intelligence: 0,
    power: 0,
    agility: 5,
    vip: "No",
    type: "PETS"
  },
  {
    id: 7,
    name: "Dog1",
    btamin: -50,
    btamin_sell: 25,
    min_level: 1,
    endurance: 0,
    intelligence: 0,
    power: 0,
    agility: 5,
    vip: "No",
    type: "PETS"
  },
  {
    id: 8,
    name: "Dog2",
    btamin: -50,
    btamin_sell: 25,
    min_level: 1,
    endurance: 0,
    intelligence: 0,
    power: 0,
    agility: 5,
    vip: "No",
    type: "PETS"
  },
  {
    id: 9,
    name: "Dog3",
    btamin: -50,
    btamin_sell: 25,
    min_level: 1,
    endurance: 0,
    intelligence: 0,
    power: 0,
    agility: 5,
    vip: "No",
    type: "PETS"
  },
  {
    id: 10,
    name: "Robot1",
    btamin: -50,
    btamin_sell: 25,
    min_level: 1,
    endurance: 0,
    intelligence: 0,
    power: 0,
    agility: 5,
    vip: "No",
    type: "PETS"
  },
  {
    id: 11,
    name: "Robot2",
    btamin: -50,
    btamin_sell: 25,
    min_level: 1,
    endurance: 0,
    intelligence: 0,
    power: 0,
    agility: 5,
    vip: "No",
    type: "PETS"
  },
  {
    id: 12,
    name: "Robot3",
    btamin: -50,
    btamin_sell: 25,
    min_level: 1,
    endurance: 0,
    intelligence: 0,
    power: 0,
    agility: 5,
    vip: "No",
    type: "PETS"
  }
];
Pet.find({}, function (err, data) {
  if (!data[0]) {
    Pet.insertMany(docs);
    console.log("insert Pet successful !");
  } else {
    Pet.collection.drop();
    Pet.insertMany(docs);
    console.log("delete and insert Pet successful !");
  }
});