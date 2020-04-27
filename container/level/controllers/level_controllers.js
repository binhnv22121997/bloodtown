var express = require("express");
var router = express.Router();
var level_services = require('../services/level_services');

router.post('/inforLevels', async (req, res) => {
  let levels = await level_services.getAll();
  res.json(levels);
});

module.exports = router;