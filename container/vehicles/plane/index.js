var { url } = require('../../../config/connectDB');
var mongoose = require('mongoose');
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
var Plane = require('./models/plane');
var docs = [
  {
    id: 1,
    name: "Planes1",
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
    type: "Planes"
  },
  {
    id: 2,
    name: "Planes2",
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
    type: "Planes"
  },
  {
    id: 3,
    name: "Planes3",
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
    type: "Planes"
  },
  {
    id: 4,
    name: "Planes4",
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
    type: "Planes"
  },
  {
    id: 5,
    name: "Planes5",
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
    type: "Planes"
  },
];
Plane.find({}, function (err, data) {
  if (!data[0]) {
    Plane.insertMany(docs);
    console.log("insert Plane successful !");
  } else {
    Plane.collection.drop();
    Plane.insertMany(docs);
    console.log("delete and insert Plane successful !");
  }
});
