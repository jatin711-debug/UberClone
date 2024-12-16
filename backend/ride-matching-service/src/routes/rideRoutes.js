// src/routes/rideRoutes.js

const express = require('express');
const { createRide, getRideById } = require('../controllers/rideController.js');

const router = express.Router();

router.post('/create', createRide);
router.get('/:id', getRideById);

module.exports = router;
