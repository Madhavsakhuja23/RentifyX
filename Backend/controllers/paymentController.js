import Razorpay from "razorpay";
import crypto from "crypto";

// Lazily create the Razorpay instance so it reads env vars AFTER dotenv.config() runs.
// (ESM static imports are evaluated before dotenv.config() in index.js)
function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// POST /api/payments/create-order
export const createOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    // Validate amount (minimum 100 paise = ₹1)
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ msg: "Amount is required." });
    }

    const amountInPaise = Math.round(Number(amount));

    if (amountInPaise < 100) {
      return res.status(400).json({ msg: "Minimum amount is ₹1 (100 paise)." });
    }

    const options = {
      amount: amountInPaise,
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await getRazorpay().orders.create(options);

    res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("Razorpay create order error:", err);

    if (err.statusCode === 401) {
      return res.status(401).json({ msg: "Razorpay authentication failed. Check API credentials." });
    }

    res.status(500).json({ msg: "Failed to create Razorpay order. Please try again." });
  }
};

// POST /api/payments/verify-payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        msg: "Missing required payment verification fields.",
      });
    }

    // Compute expected signature: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        msg: "Payment signature mismatch. Verification failed.",
      });
    }

    // Signatures match — payment is genuine
    res.json({
      success: true,
      msg: "Payment verified successfully.",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (err) {
    console.error("Razorpay verify payment error:", err);
    res.status(500).json({ success: false, msg: "Payment verification failed." });
  }
};
