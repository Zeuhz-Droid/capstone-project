const Limo = require('../models/limoModel');
const shortid = require('shortid');

const { convertStrToQrCode, fetchCacheValue } = require('../utils/utils');

exports.shortenLimo = async (req, res, next) => {
  try {
    //  get the url
    const { original_url } = req.body;
    let shortID, cacheKey, qrCode;

    // check if user inserted originalUrl
    if (!original_url)
      res.render('index', {
        data: {
          shortenedLimo: null,
          error: `you haven't inserted any link/limos.`,
        },
      });

    // check if original_url already exists in database
    const url = await Limo.findOne({ original_url });

    // get shortid of existing url
    if (url) {
      shortID = url.shortened_url;
      cacheKey = url.qr_code;
      qrCode = fetchCacheValue(cacheKey);
      res.render('index', {
        data: { shortenedLimo: shortID, error: null, qr_code: qrCode },
      });
      return;
    }

    if (!url) {
      // converts string(url) to qrcode, if url doesn't exists
      cacheKey = convertStrToQrCode(original_url);

      // generate short ID which will be sent to user
      shortID = shortid.generate();
    }

    // save url info to database
    await Limo.create({
      original_url,
      shortened_url: shortID,
      qr_code: cacheKey,
    });

    //  fetch cached value (qr code) from cached memory
    if (cacheKey) qrCode = fetchCacheValue(cacheKey);

    res.render('index', {
      data: { shortenedLimo: shortID, error: null, qr_code: qrCode },
    });
  } catch (err) {
    res.render('index', {
      data: { shortenedLimo: null, error: err.message, qr_code: null },
    });
  }
};

exports.getSiteFromShortenedLimo = async (req, res, next) => {
  try {
    const { shortID } = req.params;

    const limo = await Limo.findOne({ shortened_url: shortID });

    if (!limo) res.status(400).send('Link not Found.');

    res.redirect(limo.original_url);
  } catch (error) {
    console.error('Error retrieving link:', error.message);
    res.status(500).json({
      status: 'failed',
      error: 'An error occurred while retrieving the link',
    });
  }
};
