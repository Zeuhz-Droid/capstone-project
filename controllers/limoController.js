const Limo = require('../models/limoModel');
const shortid = require('shortid');

const { convertStrToQrCode, fetchCacheValue } = require('../utils/utils');

exports.shortenLimo = async (req, res, next) => {
  try {
    //  get the url
    const { original_url } = req.body;
    let shortID, cacheKey, qrCode, limos;

    // check if user inserted originalUrl
    if (!original_url)
      res.render('index', {
        data: {
          shortenedLimo: null,
          error: `you haven't inserted any link/limos.`,
        },
      });

    // check if original_url already exists in database
    const url = await Limo.findOne({ user: req.user.id, original_url });

    if (!url) {
      // converts string(url) to qrcode, if url doesn't exists

      cacheKey = await convertStrToQrCode(original_url);

      // render error if no cached key found
      if (!cacheKey) {
        res.status(500).json({
          status: 'failed',
          error: `Couldn't fetch cached link`,
        });
      }

      // generate short ID which will be sent to user
      shortID = shortid.generate();

      // save url info to database
      await Limo.create({
        original_url,
        shortened_url: shortID,
        qr_code: cacheKey,
        user: req.user.id,
      });

      //  fetch cached value (qr code) from cached memory
      if (cacheKey) qrCode = fetchCacheValue(cacheKey);
    }

    // get shortid of existing url
    if (url) {
      shortID = url.shortened_url;
      cacheKey = url.qr_code;
      qrCode = fetchCacheValue(url.qr_code);
    }

    // find links created by current user
    limos = await Limo.find({ user: req.user.id });

    // render user info
    res.render('index', {
      data: {
        shortenedLimo: shortID,
        error: null,
        qr_code: qrCode,
        username: req.user.username,
        history: limos,
      },
    });

    return;
  } catch (err) {
    res.render('index', {
      data: { shortenedLimo: null, error: err.message, qr_code: null },
    });
  }
};

exports.getSiteFromShortenedLimo = async (req, res, next) => {
  try {
    // get the shortened url form the params
    const { shortID } = req.params;

    // fetch shortID
    const limo = await Limo.findOne({ shortened_url: shortID });

    // return error message if link not found
    if (!limo) res.status(400).send('Link not Found.');

    // update analytics
    limo.updateAnalytics();

    // saved analytics update
    await limo.save();

    // redirect user to original url
    res.redirect(limo.original_url);

    return;
  } catch (error) {
    console.error('Error retrieving link:', error.message);
    // res.status(500).json({
    //   status: 'failed',
    //   error: 'An error occurred while retrieving the link',
    // });
  }
};
