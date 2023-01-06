const crypto = require('crypto');
const util = require('util');

const randomBytesAsync = util.promisify(crypto.randomBytes);

class TokenHelpers {
  static async generateRandomToken(length) {
    const result = await randomBytesAsync(length);
    return result.toString('hex');
  }
}

module.exports = TokenHelpers;