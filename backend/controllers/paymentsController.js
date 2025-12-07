const pool = require("../config/database");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Create payment intent (Stripe)
const createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.params;
    const customerId = req.customer?.id;

    if (!customerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get order details
    const [orders] = await pool.execute(
      `SELECT o.*, c.first_name, c.last_name, c.email 
       FROM orders o 
       JOIN customers c ON o.customer_id = c.id 
       WHERE o.id = ? AND o.customer_id = ?`,
      [orderId, customerId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orders[0];

    if (!order.total_amount || order.total_amount <= 0) {
      return res
        .status(400)
        .json({ message: "Order amount must be greater than 0" });
    }

    if (order.payment_status === "paid") {
      return res.status(400).json({ message: "Order already paid" });
    }

    // Convert amount to cents (Stripe uses smallest currency unit)
    const amountInCents = Math.round(order.total_amount * 100);

    // Create Stripe payment intent
    let paymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: "usd",
        metadata: {
          order_id: orderId.toString(),
          customer_id: customerId.toString(),
          customer_name: `${order.first_name} ${order.last_name}`,
        },
        description: `Payment for Order #${orderId}`,
      });
    } catch (stripeError) {
      console.error("Stripe error:", stripeError);
      // If Stripe is not configured, return mock payment intent
      if (
        !process.env.STRIPE_SECRET_KEY ||
        process.env.STRIPE_SECRET_KEY === ""
      ) {
        return res.json({
          clientSecret: "mock_payment_intent_secret",
          paymentIntentId: `mock_${Date.now()}`,
          amount: order.total_amount,
          message:
            "Stripe not configured. Using mock payment for development.",
        });
      }
      return res.status(500).json({
        message: "Payment processing error",
        error: stripeError.message,
      });
    }

    // Create payment record in database
    await pool.execute(
      `INSERT INTO payments (order_id, customer_id, amount, payment_method, payment_intent_id, status)
       VALUES (?, ?, ?, 'stripe', ?, 'pending')`,
      [orderId, customerId, order.total_amount, paymentIntent.id]
    );

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: order.total_amount,
    });
  } catch (error) {
    console.error("Create payment intent error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Confirm payment (webhook or manual confirmation)
const confirmPayment = async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body;
    const customerId = req.customer?.id;

    if (!customerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify payment intent with Stripe
    let paymentIntent;
    try {
      if (
        paymentIntentId &&
        paymentIntentId.startsWith("mock_") &&
        (!process.env.STRIPE_SECRET_KEY ||
          process.env.STRIPE_SECRET_KEY === "")
      ) {
        // Mock payment for development
        paymentIntent = {
          id: paymentIntentId,
          status: "succeeded",
          amount: 0,
        };
      } else if (process.env.STRIPE_SECRET_KEY) {
        paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      } else {
        return res.status(400).json({
          message: "Stripe not configured. Cannot verify payment.",
        });
      }
    } catch (stripeError) {
      console.error("Stripe verification error:", stripeError);
      return res.status(400).json({
        message: "Invalid payment intent",
        error: stripeError.message,
      });
    }

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        message: `Payment not completed. Status: ${paymentIntent.status}`,
      });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Update payment record
      await connection.execute(
        `UPDATE payments 
         SET status = 'completed', transaction_id = ?, updated_at = NOW()
         WHERE order_id = ? AND payment_intent_id = ?`,
        [paymentIntent.id, orderId, paymentIntentId]
      );

      // Update order payment status
      await connection.execute(
        `UPDATE orders 
         SET payment_status = 'paid', updated_at = NOW()
         WHERE id = ?`,
        [orderId]
      );

      await connection.commit();

      // Fetch updated order
      const [updated] = await connection.execute(
        `SELECT o.*, c.first_name, c.last_name, c.email 
         FROM orders o 
         JOIN customers c ON o.customer_id = c.id 
         WHERE o.id = ?`,
        [orderId]
      );

      res.json({
        message: "Payment confirmed successfully",
        order: updated[0],
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Confirm payment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get payment history for an order
const getPaymentHistory = async (req, res) => {
  try {
    const { orderId } = req.params;
    const customerId = req.customer?.id;

    if (!customerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify order belongs to customer
    const [orders] = await pool.execute(
      "SELECT id FROM orders WHERE id = ? AND customer_id = ?",
      [orderId, customerId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Get payment history
    const [payments] = await pool.execute(
      `SELECT * FROM payments 
       WHERE order_id = ? 
       ORDER BY created_at DESC`,
      [orderId]
    );

    res.json({ payments });
  } catch (error) {
    console.error("Get payment history error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Stripe webhook handler
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return res.status(400).json({ message: "Webhook secret not configured" });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;

    try {
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      // Find payment record
      const [payments] = await connection.execute(
        "SELECT * FROM payments WHERE payment_intent_id = ?",
        [paymentIntent.id]
      );

      if (payments.length > 0) {
        const payment = payments[0];

        // Update payment status
        await connection.execute(
          `UPDATE payments 
           SET status = 'completed', transaction_id = ?, updated_at = NOW()
           WHERE id = ?`,
          [paymentIntent.id, payment.id]
        );

        // Update order payment status
        await connection.execute(
          `UPDATE orders 
           SET payment_status = 'paid', updated_at = NOW()
           WHERE id = ?`,
          [payment.order_id]
        );
      }

      await connection.commit();
      connection.release();
    } catch (error) {
      console.error("Webhook processing error:", error);
    }
  }

  res.json({ received: true });
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  handleStripeWebhook,
};

