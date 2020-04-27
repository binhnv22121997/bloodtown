var Hospital = require('../models/hospital');

async function getAll() {
  return await Hospital.find({}).sort({ id: 1 });;
}

module.exports = {
  getAll
}