var express = require("express");
var router = express.Router();
var vehicles_services = require("../services/vehicles_services");
var HistoryVehicle = require('../../history/historyVehicle/history_vehicle');

router.post("/getVehicles", async (req, res) => {
  let vehicles = await vehicles_services.getAll();
  res.json({
    vehicles
  })
});

router.post("/buyVehicle", async (req, res) => {
  let userId = req.user.userId;
  let userToken = req.user.userToken;
  let vehicleId = parseInt(req.body.vehicleId) || 0;
  var vehicleType = req.body.vehicleType;
  let user = await vehicles_services.buyVehicle(userId, userToken, vehicleId, vehicleType);
  await HistoryVehicle.create({
    userId,
    vehicleId: vehicleId,
    vehicleType: vehicleType,
    action: 'buy',
    data: user.data,
    success: user.success,
    message: user.message,
    reqData: user.reqData,
    resData: user.resData,
    createAt: Date.now()
  });
  delete user["reqData"];
  delete user["resData"];
  res.json(user);
});

router.post("/sellVehicle", async (req, res) => {
  let userId = req.user.userId;
  let userToken = req.user.userToken;
  let vehicleId = parseInt(req.body.vehicleId) || 0;
  var vehicleType = req.body.vehicleType;
  let user = await vehicles_services.sellVehicle(userId, userToken, vehicleId, vehicleType);
  await HistoryVehicle.create({
    userId,
    vehicleId: vehicleId,
    vehicleType: vehicleType,
    action: 'sell',
    data: user.data,
    success: user.success,
    message: user.message,
    reqData: user.reqData,
    resData: user.resData,
    createAt: Date.now()
  });
  delete user["reqData"];
  delete user["resData"];
  res.json(user);
});

router.post("/upgradeVehicle", async (req, res) => {
  let userId = req.user.userId;
  let userToken = req.user.userToken;
  let vehicleId = parseInt(req.body.vehicleId) || 0;
  var vehicleType = req.body.vehicleType;
  var upgradeType = req.body.upgradeType;
  let user = await vehicles_services.upgradeVehicle(userId, userToken, vehicleId, vehicleType, upgradeType);
  await HistoryVehicle.create({
    userId,
    vehicleId: vehicleId,
    vehicleType: vehicleType,
    upgradeType: upgradeType,
    action: 'upgrade',
    data: user.data,
    success: user.success,
    message: user.message,
    reqData: user.reqData,
    resData: user.resData,
    createAt: Date.now()
  });
  delete user["reqData"];
  delete user["resData"];
  res.json(user);
});

module.exports = router;