const crypto = require('crypto');
const ALGORITHM = 'aes-256-cbc';
const KEY = crypto.scryptSync(process.env.API_ACCESS_SECRET, 'salt', 32);
const IV = Buffer.alloc(16, 0); // Initialization crypto vector


function encryptedText(){
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, IV);
  let encrypted = cipher.update(`{"username":"${process.env.AUTH_USER}","password":"${process.env.AUTH_PWD}"}`, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decryptedText(text) {
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, IV);
  try {
    let decrypted = decipher.update(text, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return {
      status: 200,
      message: decrypted
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message
    }
  }
}

module.exports = {
  encryptedText,
  decryptedText
}