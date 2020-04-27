var express = require("express");
var router = express.Router();
var upgrade_services = require("../services/upgrade_services");
var HistoryUpgrade = require('../../history/historyUpgrade/history_upgrade');

router.post('/inforUpgrades', async (req, res) => {
  let upgrades = await upgrade_services.getAll();
  res.json(upgrades);
});

router.post('/buyUpgrade', async (req, res) => {
  let userId = req.user.userId;
  let userToken = req.user.userToken;
  let upgradeId = parseInt(req.body.upgradeId) || 0;
  let upgradeType = req.body.upgradeType;
  let user = await upgrade_services.buyUpgrade(userId, userToken, upgradeId, upgradeType);
  await HistoryUpgrade.create({
    userId,
    upgradeId,
    upgradeType,
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

module.exports = router;