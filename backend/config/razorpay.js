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
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.warn("Razorpay credentials missing in process.env");
    } else {
      razorpayInstance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
      console.log("Razorpay initialized successfully");
    }
  } catch (error) {
    console.error("Failed to initialize Razorpay:", error.message);
  }
} else {
  console.warn("Razorpay module not found");
}

module.exports = razorpayInstance;
