const QRCode = require('qrcode');
const NodeCache = require('node-cache');
const vrandom = require('vrandom');

const myCache = new NodeCache();

const generateKey = () => {
  const key = vrandom.string(10, 'alphanumeric');
  while (myCache.has(key)) generateKey();
  return key;
};

const cacheString = (key, str) => {
  return myCache.set(key, str, 86400);
};

const convertStrToQrCode = (str) => {
  let cacheKey,
    qr_size = 200;
  // convert str into qrcode (string)
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(
      JSON.stringify(str),
      { errorCorrectionLevel: 'H', width: qr_size },
      function (err, dataUrl) {
        if (err) reject(err);

        // generate cache key
        cacheKey = generateKey();

        // cache qr using key generated
        const cached = cacheString(cacheKey, dataUrl);

        // return cacheKey If cache happened
        if (cached) resolve(cacheKey);
      }
    );
  });
};

const fetchCacheValue = (key) => {
  return myCache.get(key);
};

module.exports = {
  generateKey,
  cacheString,
  convertStrToQrCode,
  fetchCacheValue,
};
