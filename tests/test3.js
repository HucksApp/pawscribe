//import CryptoJS from 'crypto-js';

const CryptoJS = require('crypto-js');

const hashSHA256 = message => {
  return  CryptoJS.SHA256(CryptoJS.enc.Utf8.parse(message)).toString(CryptoJS.enc.Hex);
};


const message = "your content here".trim();

console.log(hashSHA256(message))