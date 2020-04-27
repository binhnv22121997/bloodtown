var express = require("express");
var router = express.Router();
var school_services = require('../services/school_services');

router.post('/inforSchools', async (req, res) => {
  let schools = await school_services.getAll();
  res.json(schools);
});

module.exports = router;