const QRCode = require('qrcode');

const generateQRCode = async (data) => {
  try {
    const qrDataUrl = await QRCode.toDataURL(JSON.stringify(data), {
      width: 300,
      margin: 2,
      color: {
        dark: '#1a1a2e',
        light: '#ffffff'
      }
    });
    return qrDataUrl;
  } catch (error) {
    console.error('QR Code generation error:', error);
    throw new Error('Failed to generate QR code');
  }
};

module.exports = generateQRCode;
