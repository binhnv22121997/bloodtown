var express = require("express");
var router = express.Router();
var hospital_services = require('../services/hospital_services');

router.post('/inforHospitals', async (req, res) => {
  let hospitals = await hospital_services.getAll();
  res.json(hospitals);
});

module.exports = router;