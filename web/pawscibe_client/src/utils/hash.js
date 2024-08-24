import CryptoJS from 'crypto-js';

const hashSHA256 = message => {
  return CryptoJS.SHA256(CryptoJS.enc.Utf8.parse(message.trim())).toString(
    CryptoJS.enc.Hex
  );
};

export default hashSHA256;
