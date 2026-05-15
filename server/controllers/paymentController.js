const Payment = require('../models/Payment');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay (Requires RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env)
const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID) return null;
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

exports.createOrder = async (req, res, next) => {
  try {
    const { amount, purpose, referenceId } = req.body;
    
    const payment = await Payment.create({
      user: req.user._id,
      amount,
      purpose,
      referenceId
    });

    const rzp = getRazorpayInstance();
    if (!rzp) {
      // Mock mode if API keys are missing
      return res.status(201).json({ 
        success: true, 
        order: { id: `mock_order_${payment._id}`, amount: amount * 100 },
        payment 
      });
    }

    const options = {
      amount: amount * 100, // paise
      currency: 'INR',
      receipt: payment._id.toString()
    };

    const order = await rzp.orders.create(options);
    payment.razorpayOrderId = order.id;
    await payment.save();

    res.status(201).json({ success: true, order, payment });
  } catch (error) { next(error); }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId } = req.body;
    
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });

    if (!process.env.RAZORPAY_KEY_SECRET) {
      // Mock verify
      payment.status = 'Completed';
      payment.razorpayPaymentId = razorpay_payment_id || `mock_pay_${Date.now()}`;
      await payment.save();
      return res.status(200).json({ success: true, payment });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                                    .update(body.toString())
                                    .digest('hex');

    if (expectedSignature === razorpay_signature) {
      payment.status = 'Completed';
      payment.razorpayPaymentId = razorpay_payment_id;
      await payment.save();
      res.status(200).json({ success: true, payment });
    } else {
      payment.status = 'Failed';
      await payment.save();
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) { next(error); }
};

exports.getHistory = async (req, res, next) => {
  try {
    const filter = req.user.role === 'student' ? { user: req.user._id } : {};
    const payments = await Payment.find(filter).sort('-createdAt');
    res.status(200).json({ success: true, payments });
  } catch (error) { next(error); }
};
