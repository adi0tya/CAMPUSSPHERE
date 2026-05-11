const express = require('express');
const router = express.Router();
const { seedShipments } = require('../controllers/seedController');

router.post('/shipments', seedShipments);

module.exports = router;
