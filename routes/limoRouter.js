const express = require('express');
const limoController = require('../controllers/limoController');

const router = express.Router();

// routes/limoRouter.js

/**
 * @swagger
 * components:
 *   schemas:
 *     Limo:
 *       type: object
 *       properties:
 *         original_url:
 *           type: string
 *           description: The limo url.
 *           example: https://youtube.com/shorts/_wh-Ax0Bc5g?feature=share4
 *         date_created:
 *           type: date
 *           description: The date link was shortened.
 *           example: Sat Jul 01-06-2023 12:09:56
 *         user:
 *           type: string
 *           description: Name of the user that owns link/limo.
 */

/**
 * @swagger
 * /shorten:
 *   post:
 *     summary: shortens url link/limo from users
 *     description: shortens the original lengthy links pasted by user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Limo'
 *     responses:
 *       200:
 *         description: A shortened link/limo.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/Limo'
 */
router.route('/shorten').post(limoController.shortenLimo);

/**
 * @swagger
 * /:shortID:
 *   get:
 *     summary: Retrieves original url and redirect user to path
 *     description: Retrieves the original version of the shortened link/limo and redirects user to the path destination.
 *     parameters:
 *       - in: path
 *         shortened_url: K2iEJbXSM
 *         required: true
 *         description: shortened url required to retrieve original url.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Original Limo Retrieved & Redirected.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     original_url:
 *                       type: string
 *                       description: The original url link.
 *                       example: "https://youtube.com/shorts/_wh-Ax0Bc5g?feature=share4"
 */

router.route('/shortID/:shortID').get(limoController.getSiteFromShortenedLimo);

router.route('delID/:shortID').delete(limoController.delShortenedLimo);

module.exports = router;
