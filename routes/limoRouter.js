const express = require('express');
const limoController = require('../controllers/limoController');

const router = express.Router();

router.route('/shorten').post(limoController.shortenLimo);

router.route('/:shortID').get(limoController.getSiteFromShortenedLimo);

module.exports = router;
