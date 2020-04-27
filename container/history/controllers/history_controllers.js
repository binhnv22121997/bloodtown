var express = require("express");
var router = express.Router();
var history_item_services = require("../services/history_services");

router.post("/inforHistoryItem", async (req, res) => {
  let userId = req.user.userId;
  let itemId = parseInt(req.body.itemId);
  let action = req.body.action;
  let dateFrom = parseInt(req.body.dateFrom);
  let dateTo = parseInt(req.body.dateTo);
  let history = await history_item_services.getHistoryItem(userId, itemId, action, dateFrom, dateTo);
  res.json(history);
});

router.post("/inforHistoryPet", async (req, res) => {
  let userId = req.user.userId;
  let petId = parseInt(req.body.petId);
  let action = req.body.action;
  let dateFrom = parseInt(req.body.dateFrom);
  let dateTo = parseInt(req.body.dateTo);
  let history = await history_item_services.getHistoryPet(userId, petId, action, dateFrom, dateTo);
  res.json(history);
});

router.post("/inforHistoryProperty", async (req, res) => {
  let userId = req.user.userId;
  let propertyId = parseInt(req.body.propertyId);
  let action = req.body.action;
  let dateFrom = parseInt(req.body.dateFrom);
  let dateTo = parseInt(req.body.dateTo);
  let history = await history_item_services.getHistoryProperty(userId, propertyId, action, dateFrom, dateTo);
  res.json(history);
});

router.post("/inforHistoryUpgrade", async (req, res) => {
  let userId = req.user.userId;
  let upgradeId = parseInt(req.body.upgradeId);
  let upgradeType = req.body.upgradeType;
  let action = req.body.action;
  let dateFrom = parseInt(req.body.dateFrom);
  let dateTo = parseInt(req.body.dateTo);
  let history = await history_item_services.getHistoryUpgrade(userId, upgradeId, upgradeType, action, dateFrom, dateTo);
  res.json(history);
});

router.post("/inforHistoryUser", async (req, res) => {
  let userId = req.user.userId;
  let workId = parseInt(req.body.workId);
  let workType = req.body.workType;
  let action = req.body.action;
  let dateFrom = parseInt(req.body.dateFrom);
  let dateTo = parseInt(req.body.dateTo);
  let history = await history_item_services.getHistoryUser(userId, workId, workType, action, dateFrom, dateTo);
  res.json(history);
});

router.post("/inforHistoryVehicle", async (req, res) => {
  let userId = req.user.userId;
  let vehicleId = parseInt(req.body.vehicleId);
  let vehicleType = req.body.vehicleType;
  let upgradeType = req.body.upgradeType;
  let action = req.body.action;
  let dateFrom = parseInt(req.body.dateFrom);
  let dateTo = parseInt(req.body.dateTo);
  let history = await history_item_services.getHistoryVehicle(userId, vehicleId, vehicleType, upgradeType, action, dateFrom, dateTo);
  res.json(history);
});

module.exports = router;