var express = require("express");
var router = express.Router();
var gym_services = require('../services/gym_services');

router.post('/inforGyms', async (req, res) => {
  let gyms = await gym_services.getAll();
  res.json(gyms);
});

module.exports = router;