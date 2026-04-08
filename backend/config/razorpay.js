const requireRazorpay = () => {
  try {
    return require('razorpay');
  } catch (e) {
    return null;
  }
};

const Razorpay = requireRazorpay();

let razorpayInstance = null;
if (Razorpay) {
  try {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  } catch (error) {
    console.warn("Failed to initialize Razorpay. Have you provided RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET?");
  }
}

module.exports = razorpayInstance;
