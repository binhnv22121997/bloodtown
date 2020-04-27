var HistoryItem = require('../historyItem/history_item');
var HistoryPet = require('../historyPet/history_pet');
var HistoryProperty = require('../historyProperty/history_property');
var HistoryUpgrade = require('../historyUpgrade/history_upgrade');
var HistoryUser = require('../historyUser/history_upgrade');
var HistoryVehicle = require('../historyVehicle/history_vehicle');

async function getHistoryItem(userId, itemId, action, dataFrom, dateTo) {
  let query = [{ userId }];
  if (itemId) {
    query.push({ itemId });
  }
  if (action) {
    query.push({ action });
  }
  if (dataFrom && dateTo) {
    query.push({ time: { $gte: dataFrom } });
    query.push({ time: { $lte: dateTo } });
  }
  return await HistoryItem.find({ $and: query });
}

async function getHistoryPet(userId, petId, action, dataFrom, dateTo) {
  let query = [{ userId }];
  if (petId) {
    query.push({ petId });
  }
  if (action) {
    query.push({ action });
  }
  if (dataFrom && dateTo) {
    query.push({ time: { $gte: dataFrom } });
    query.push({ time: { $lte: dateTo } });
  }
  return await HistoryPet.find({ $and: query });
}

async function getHistoryProperty(userId, propertyId, action, dataFrom, dateTo) {
  let query = [{ userId }];
  if (propertyId) {
    query.push({ propertyId });
  }
  if (action) {
    query.push({ action });
  }
  if (dataFrom && dateTo) {
    query.push({ time: { $gte: dataFrom } });
    query.push({ time: { $lte: dateTo } });
  }
  return await HistoryProperty.find({ $and: query });
}

async function getHistoryUpgrade(userId, upgradeId, upgradeType, action, dataFrom, dateTo) {
  let query = [{ userId }];
  if (upgradeId) {
    query.push({ upgradeId });
  }
  if (upgradeType) {
    query.push({ upgradeType });
  }
  if (action) {
    query.push({ action });
  }
  if (dataFrom && dateTo) {
    query.push({ time: { $gte: dataFrom } });
    query.push({ time: { $lte: dateTo } });
  }
  return await HistoryUpgrade.find({ $and: query });
}

async function getHistoryUser(userId, workId, workType, action, dataFrom, dateTo) {
  let query = [{ userId }];
  if (workId) {
    query.push({ workId });
  }
  if (workType) {
    query.push({ workType });
  }
  if (action) {
    query.push({ action });
  }
  if (dataFrom && dateTo) {
    query.push({ time: { $gte: dataFrom } });
    query.push({ time: { $lte: dateTo } });
  }
  return await HistoryUser.find({ $and: query });
}

async function getHistoryVehicle(userId, vehicleId, vehicleType, upgradeType, action, dataFrom, dateTo) {
  let query = [{ userId }];
  if (vehicleId) {
    query.push({ vehicleId });
  }
  if (vehicleType) {
    query.push({ vehicleType });
  }
  if (upgradeType) {
    query.push({ upgradeType });
  }
  if (action) {
    query.push({ action });
  }
  if (dataFrom && dateTo) {
    query.push({ time: { $gte: dataFrom } });
    query.push({ time: { $lte: dateTo } });
  }
  return await HistoryVehicle.find({ $and: query });
}

module.exports = {
  getHistoryItem,
  getHistoryPet,
  getHistoryProperty,
  getHistoryUpgrade,
  getHistoryUser,
  getHistoryVehicle
};