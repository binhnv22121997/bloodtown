var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var toobusy = require('toobusy-js');

var User = require('./container/user/models/user');
var crypto = require('crypto-js');

var server = require("http").Server(app);
const PORT = parseInt(process.env.PORT) || 5000;
var io = require("socket.io")(server);
server.listen(PORT, () => console.log("Server running in port " + PORT));

var { checkToken } = require('./helper/token');
var { url } = require('./config/connectDB');
var users = require('./container/user/controllers/user_controllers');
var pets = require('./container/pet/controllers/pet_controller');
var shop = require('./container/shop/controllers/shop_controllers');
var vehicles = require('./container/vehicles/controllers/vehicles_controllers');
var upgrades = require('./container/upgrade/controllers/upgrade_controllers');
var properties = require('./container/property/controllers/property_controllers');
var gyms = require('./container/gym/controllers/gym_controllers');
var works = require('./container/work/controllers/work_controllers');
var schools = require('./container/school/controllers/school_controllers');
var hospitals = require('./container/hospital/controllers/hospital_controllers');
var histories = require('./container/history/controllers/history_controllers');
var levels = require('./container/level/controllers/level_controllers');

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: false,
  useFindAndModify: false,
  useCreateIndex: true,
});

app.use(function (req, res, next) {
  if (toobusy()) {
    res.status(503).json({
      success: false,
      message: "Server too busy !"
    });
  } else {
    next();
  }
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

io.on("connection", function (socket) {
  // console.log(socket.id + ": connected");
  socket.on("disconnect", async function () {
    let userById = await User.findOne({ socketId: socket.id });
    if (userById) {
      userById.isOnline = false;
      userById.socketId = '';
      await userById.save();
    }
    // console.log(socket.id + ": disconnected");
  });
  socket.on("reconnect", async function () {
    console.log(socket.id + ": reconnected");
  });
  socket.on("online", async function (data) {
    let bytesUserId = crypto.AES.decrypt(data, process.env.secret);
    let userId = bytesUserId.toString(crypto.enc.Utf8);
    let userById = await User.findOne({ id: userId });
    if (userById) {
      userById.isOnline = true;
      userById.socketId = socket.id;
      userById.isPending = false;
      await userById.save();
    }
  });
});

app.use('/users', checkToken, users);
app.use('/pets', checkToken, pets);
app.use('/shop', checkToken, shop);
app.use('/vehicles', checkToken, vehicles);
app.use('/upgrades', checkToken, upgrades);
app.use('/properties', checkToken, properties);
app.use('/gyms', checkToken, gyms);
app.use('/works', checkToken, works);
app.use('/schools', checkToken, schools);
app.use('/hospitals', checkToken, hospitals);
app.use('/histories', checkToken, histories);
app.use('/levels', checkToken, levels);

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});