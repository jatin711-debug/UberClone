const express = require('express');
const { findMatch } = require('../controllers/matchController.js');

const router = express.Router();

router.post('/find', findMatch);

module.exports = router;
