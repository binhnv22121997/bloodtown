var { url } = require('../../../config/connectDB');
var mongoose = require('mongoose');
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
var Boat = require('./models/boat');
var docs = [
  {
    id: 1,
    name: "Boats1",
    btamin: -50,
    btamin_sell: 25,
    min_level: 1,
    speed: 10,
    upgrade_speed: [1, 1, 1, 1, 1],
    upgrade_speed_btamin: [-1200, -2400, -3600, -4800, -6000],
    acceleration: 5,
    upgrade_acceleration: [1, 1, 1, 1, 1],
    upgrade_acceleration_btamin: [-1200, -2400, -3600, -4800, -6000],
    stability: 5,
    upgrade_stability: [1, 1, 1, 1, 1],
    upgrade_stability_btamin: [-1200, -2400, -3600, -4800, -6000],
    type: "Boats"
  },
  {
    id: 2,
    name: "Boats2",
    btamin: -50,
    btamin_sell: 25,
    min_level: 1,
    speed: 10,
    upgrade_speed: [1, 1, 1, 1, 1],
    upgrade_speed_btamin: [-1200, -2400, -3600, -4800, -6000],
    acceleration: 5,
    upgrade_acceleration: [1, 1, 1, 1, 1],
    upgrade_acceleration_btamin: [-1200, -2400, -3600, -4800, -6000],
    stability: 5,
    upgrade_stability: [1, 1, 1, 1, 1],
    upgrade_stability_btamin: [-1200, -2400, -3600, -4800, -6000],
    type: "Boats"
  },
  {
    id: 3,
    name: "Boats3",
    btamin: -50,
    btamin_sell: 25,
    min_level: 1,
    speed: 10,
    upgrade_speed: [1, 1, 1, 1, 1],
    upgrade_speed_btamin: [-1200, -2400, -3600, -4800, -6000],
    acceleration: 5,
    upgrade_acceleration: [1, 1, 1, 1, 1],
    upgrade_acceleration_btamin: [-1200, -2400, -3600, -4800, -6000],
    stability: 5,
    upgrade_stability: [1, 1, 1, 1, 1],
    upgrade_stability_btamin: [-1200, -2400, -3600, -4800, -6000],
    type: "Boats"
  },
  {
    id: 4,
    name: "Boats4",
    btamin: -50,
    btamin_sell: 25,
    min_level: 1,
    speed: 10,
    upgrade_speed: [1, 1, 1, 1, 1],
    upgrade_speed_btamin: [-1200, -2400, -3600, -4800, -6000],
    acceleration: 5,
    upgrade_acceleration: [1, 1, 1, 1, 1],
    upgrade_acceleration_btamin: [-1200, -2400, -3600, -4800, -6000],
    stability: 5,
    upgrade_stability: [1, 1, 1, 1, 1],
    upgrade_stability_btamin: [-1200, -2400, -3600, -4800, -6000],
    type: "Boats"
  },
  {
    id: 5,
    name: "Boats5",
    btamin: -50,
    btamin_sell: 25,
    min_level: 1,
    speed: 10,
    upgrade_speed: [1, 1, 1, 1, 1],
    upgrade_speed_btamin: [-1200, -2400, -3600, -4800, -6000],
    acceleration: 5,
    upgrade_acceleration: [1, 1, 1, 1, 1],
    upgrade_acceleration_btamin: [-1200, -2400, -3600, -4800, -6000],
    stability: 5,
    upgrade_stability: [1, 1, 1, 1, 1],
    upgrade_stability_btamin: [-1200, -2400, -3600, -4800, -6000],
    type: "Boats"
  },
];
Boat.find({}, function (err, data) {
  if (!data[0]) {
    Boat.insertMany(docs);
    console.log("insert Boat successful !");
  } else {
    Boat.collection.drop();
    Boat.insertMany(docs);
    console.log("delete and insert Boat successful !");
  }
});
