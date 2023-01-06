const crypto = require('crypto');
const util = require('util');
const randomBytesAsync = util.promisify(crypto.randomBytes);

class CryptoHelpers {

  static async getPasswordSalt(length) {
    const randomBytes = await randomBytesAsync(Math.ceil(length / 2));

    return randomBytes.toString('hex').slice(0, length);
  }

  static async sha512(password, salt) {
    return new Promise((resolve, reject) => {
      try {
        const hash = crypto.createHmac('sha512', salt);
        hash.update(password);
        const value = hash.digest('hex');
        resolve({ salt, passwordHash: value, });
      } catch (err) {
        reject(err);
      }
    });
  }

  static async saltHashPassword(password) {
    const salt = await this.getPasswordSalt(16);
    const passwordData = await this.sha512(password, salt);

    return passwordData;
  }

  static async sha256Hash(value) {
    return new Promise((resolve, reject) => {
      try {

        const hash = crypto.createHash('sha256');
        hash.update(value);
        resolve(hash.digest('hex'));
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = CryptoHelpers;