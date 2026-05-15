const generateOTP = () => {
  // Generate a 6 digit random OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = generateOTP;
