var express = require("express");
var router = express.Router();
var pet_services = require("../services/pet_services");
var HistoryPet = require('../../history/historyPet/history_pet');

router.post('/inforPets', async (req, res) => {
  let pets = await pet_services.getAll();
  res.json(pets);
});

router.post('/buyPet', async (req, res) => {
  let userId = req.user.userId;
  let userToken = req.user.userToken;
  let petId = parseInt(req.body.petId) || 0;
  let user = await pet_services.buyPet(userId, userToken, petId);
  await HistoryPet.create({
    userId,
    petId,
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

router.post('/sellPet', async (req, res) => {
  let userId = req.user.userId;
  let userToken = req.user.userToken;
  let petId = parseInt(req.body.petId) || 0;
  let user = await pet_services.sellPet(userId, userToken, petId);
  await HistoryPet.create({
    userId,
    petId,
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
