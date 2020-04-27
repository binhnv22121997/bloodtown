var express = require("express");
var router = express.Router();
var property_services = require("../services/property_services");
var HistoryProperty = require('../../history/historyProperty/history_property');

router.post('/inforProperties', async (req, res) => {
  let properties = await property_services.getAll();
  res.json(properties);
});

router.post('/buyProperty', async (req, res) => {
  let userId = req.user.userId;
  let userToken = req.user.userToken;
  let propertyId = parseInt(req.body.propertyId) || 0;
  let user = await property_services.buyProperty(userId, userToken, propertyId);
  await HistoryProperty.create({
    userId,
    propertyId,
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

router.post('/getIncome', async (req, res) => {
  let userId = req.user.userId;
  let userToken = req.user.userToken;
  let propertyId =  parseInt(req.body.propertyId) || 0;
  let user = await property_services.getIncome(userId, userToken, propertyId);
  await HistoryProperty.create({
    userId,
    propertyId,
    action: 'getIncome',
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