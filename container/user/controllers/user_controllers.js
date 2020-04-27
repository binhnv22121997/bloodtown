var express = require("express");
var router = express.Router();
var user_services = require("../services/user_services");
var HistoryUser = require('../../history/historyUser/history_upgrade');
var { getBalance } = require('../../../helper/getBalance');

router.post("/chooseCharacter", async function (req, res) {
  valueCharacter = req.body.valueCharacter;
  let userId = req.user.userId;
  let character = await user_services.chooseCharacter(
    valueCharacter,
    userId
  );
  res.json({
    character
  });
});

router.post("/home", getBalance, async function (req, res) {
  let userId = req.user.userId;
  let balance = req.user.balance;
  let user = await user_services.getUser(userId, balance);
  let home = await user_services.getHome();
  res.json({
    user: user,
    home: home
  });
});

router.post("/getWork", async function (req, res) {
  let userId = req.user.userId;
  let userToken = req.user.userToken;
  let workId = parseInt(req.body.workId) || 0;
  var workType = req.body.workType;
  var user = await user_services.getWork(userId, userToken, workId, workType);
  await HistoryUser.create({
    userId,
    workId,
    workType,
    action: 'get',
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

router.post("/getIncomeWork", async function (req, res) {
  let userId = req.user.userId;
  let userToken = req.user.userToken;
  var user = await user_services.getIncomeWork(userId, userToken);
  await HistoryUser.create({
    userId,
    workId: user.workId,
    workType: user.workType,
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

router.post("/cancelWork", async function (req, res) {
  let userId = req.user.userId;
  var user = await user_services.cancelWork(userId);
  res.json(user);
});

router.post("/changeMainVehicle", async function (req, res) {
  let userId = req.user.userId;
  let vehicleId = parseInt(req.body.vehicleId) || 0;
  let vehicleType = req.body.vehicleType;
  var user = await user_services.changeMainVehicle(userId, vehicleId, vehicleType);
  res.json(user);
});

router.post("/racingVehicle", async function (req, res) {
  let userId = req.user.userId;
  let userToken = req.user.userToken;
  let vehicleId = parseInt(req.body.vehicleId) || 0;
  let vehicleType = req.body.vehicleType;
  var user = await user_services.racingVehicle(userId, userToken, vehicleId, vehicleType);
  await HistoryUser.create({
    userId,
    vehicleId: vehicleId,
    vehicleType: vehicleType,
    action: 'racingVehicle',
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

router.post("/fight", async function (req, res) {
  let userId = req.user.userId;
  let userToken = req.user.userToken;
  var user = await user_services.fight(userId, userToken);
  await HistoryUser.create({
    userId,
    workId: user.workId,
    workType: user.workType,
    action: 'fight',
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

router.post("/getTopUser", async function (req, res) {
  var request = configRequest(req);
  var user = await user_services.getTopUser(request);
  res.json(user);
});

function configRequest(req) {
  let search = req.body.search;
  let sort = req.body.sort;
  let order = req.body.order;
  let page = parseInt(req.body.page);
  let limit = parseInt(req.body.limit) || 50;
  let isOnline;
  if (req.body.isOnline) {
    isOnline = (req.body.isOnline === 'true');
  }
  let _sort = 1;
  let _skip = 0;
  if (order === "DESC") { // ASC 
    _sort = -1;
  }
  let querySort = { respect: -1 };
  if (sort !== undefined) {
    querySort = { [sort]: _sort };
  }
  if (page) {
    if (page >= 1) {
      _skip = (page - 1) * limit;
    }
  }
  return {
    search,
    sort: querySort,
    skip: _skip,
    limit,
    isOnline
  }
}

module.exports = router;