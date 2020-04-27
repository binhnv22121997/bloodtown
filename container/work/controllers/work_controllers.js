var express = require("express");
var router = express.Router();
var work_services = require('../services/work_services');

router.post('/inforWorks', async (req, res) => {
  let works = await work_services.getAll();
  res.json(works);
});

module.exports = router;