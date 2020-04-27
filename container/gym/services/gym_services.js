var Gym = require('../models/gym');

async function getAll() {
  return await Gym.find({}).sort({ id: 1 });;
}

module.exports = {
  getAll
}