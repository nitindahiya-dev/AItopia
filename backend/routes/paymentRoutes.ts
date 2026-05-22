import express from 'express';
import Stripe from 'stripe';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const router = express.Router();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

// Initialize Razorpay with server-side env vars
if (!process.env.RAZOR_PAY_KEY_ID || !process.env.RAZOR_PAY_SECRET_KEY) {
  console.error('Razorpay environment variables missing');
  // Optionally exit process if critical
}

const razorpay = new Razorpay({
  key_id: process.env.RAZOR_PAY_KEY_ID!,
  key_secret: process.env.RAZOR_PAY_SECRET_KEY!,
});

// Create Stripe Payment Intent
router.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({ amount, currency });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create Razorpay Order
router.post('/create-razorpay-order', async (req, res) => {
  const { amount, currency } = req.body;

  // Validate incoming data (allow 0 as a valid amount)
  if (amount === undefined || amount === null || currency === undefined || currency === null) {
    return res.status(400).json({ error: 'Amount and currency are required' });
  }

  try {
    const order = await razorpay.orders.create({
      amount: Number(amount), // Ensure it's a number (in paise)
      currency,
      receipt: `receipt_${Date.now()}`,
    });
    console.log('Created Razorpay order:', order);
    res.json({ order_id: order.id });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: error.message || 'An unknown error occurred' });
  }
});

// Verify Razorpay Payment
router.post('/verify-razorpay-payment', (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
  const secret = process.env.RAZOR_PAY_SECRET_KEY!;

  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  res.json({ success: generatedSignature === razorpay_signature });
});

export default router;
