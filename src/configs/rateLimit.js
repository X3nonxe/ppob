const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    status: 429,
    message: 'Terlalu banyak percobaan, coba lagi setelah 15 menit',
  },
  skipSuccessfulRequests: true,
});

module.exports = { authLimiter };
