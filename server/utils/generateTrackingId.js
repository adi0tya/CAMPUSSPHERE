const crypto = require('crypto');

const generateTrackingId = () => {
  const prefix = 'TS';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

module.exports = generateTrackingId;
