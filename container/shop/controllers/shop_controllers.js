var express = require("express");
var router = express.Router();
var shop_services = require("../services/shop_services");
var HistoryItem = require('../../history/historyItem/history_item');

router.post("/inforItems", async (req, res) => {
  let items = await shop_services.getAll();
  res.json({
    items: items
  });
});

router.post("/useItem", async function (req, res) {
  let userId = req.user.userId;
  let itemId = parseInt(req.body.itemId) || 0
  let user = await shop_services.useItem(userId, itemId);
  res.json(user);
});

router.post("/unUseItem", async function (req, res) {
  let userId = req.user.userId;
  let itemId = parseInt(req.body.itemId) || 0;
  let user = await shop_services.unUseItem(userId, itemId);
  res.json(user);
});

router.post("/buyItem", async function (req, res) {
  let userId = req.user.userId;
  let userToken = req.user.userToken;
  let itemId = parseInt(req.body.itemId) || 0;
  let user = await shop_services.buyItem(userId, userToken, itemId);
  await HistoryItem.create({
    userId,
    itemId,
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

router.post("/sellItem", async function (req, res) {
  let userId = req.user.userId;
  let userToken = req.user.userToken;
  let itemId = parseInt(req.body.itemId) || 0;
  let user = await shop_services.sellItem(userId, userToken, itemId);
  await HistoryItem.create({
    userId,
    itemId,
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

module.exports = router;
