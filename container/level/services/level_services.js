var Level = require('../models/level');

async function getAll() {
  return await Level.find({}).sort({ level: 1 }).select(["-_id"]);
}

module.exports = {
  getAll
}