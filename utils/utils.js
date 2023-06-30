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
  myCache.set(key, str, 86400);
  return myCache.get(key);
};

const convertStrToQrCode = (str) => {
  let cacheKey,
    qr_size = 200;
  // convert str into qrcode (string)
  QRCode.toString(
    JSON.stringify(str),
    {
      type: 'png',
      width: qr_size,
    },
    function (err, src) {
      if (err) throw err;
      // generate cache key
      cacheKey = generateKey();

      // cache qr using key generated
      cacheString(cacheKey, src);
    }
  );
  return cacheKey;
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
