const crypto = require('crypto');

export default {
  jwtSecret: process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex')
}
