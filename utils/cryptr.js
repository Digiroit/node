const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.CRYPT_SEC);


exports.encryptedString = cryptr.encrypt;
exports.decryptedString = cryptr.decrypt;
