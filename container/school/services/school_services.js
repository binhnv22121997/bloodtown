var School = require('../models/school');

async function getAll() {
  return await School.find({}).sort({ id: 1 });;
}

module.exports = {
  getAll
}