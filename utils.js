const CryptoJS = require('crypto-js');
const fs = require('fs');
const verifyCode = () => CryptoJS.MD5((new Date).toUTCString()).toString();
const userToken = () => {
  try {
    return JSON.parse(fs.readFileSync('./token.json').toString());
  } catch (e) {
    return '';
  }
};

function fsExistsSync(path) {
  try {
    fs.accessSync(path, fs.F_OK);
  } catch (e) {
    return false;
  }
  return true;
}

module.exports = {
  verifyCode,
  userToken,
  fsExistsSync,
};
