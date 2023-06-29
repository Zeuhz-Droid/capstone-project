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
  myCache.set(key, str, 18000);
  return myCache.get(key);
};

const convertStrToQrCode = (str) => {
  // convert str into qrcode (string)
  const qr = QRCode.toString(
    JSON.stringify(str),
    { errorCorrectionLevel: 'H', type: 'png' },
    function (err) {
      if (err) throw err;
      console.log(`QR code saved!`);
    }
  );

  // cache qr code string created above
  const cacheKey = generateKey();
  cacheString(cacheKey, qr);

  return cacheKey;
};

module.exports = {
  generateKey,
  cacheString,
  convertStrToQrCode,
};
