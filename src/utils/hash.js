import CryptoJS from 'crypto-js';

const hashSHA256 = message => {
  return CryptoJS.SHA256(CryptoJS.enc.Utf8.parse(message.trim())).toString(
    CryptoJS.enc.Hex
  );
};

// This can handle binary data (for files)
export const hashSHA256Binary = arrayBuffer => {
  const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer); // Convert ArrayBuffer to CryptoJS WordArray
  return CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);
};

export default hashSHA256;
