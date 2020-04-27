var Work = require('../models/work');

async function getAll() {
  return await Work.find({}).sort({ id: 1 });;
}

module.exports = {
  getAll
}