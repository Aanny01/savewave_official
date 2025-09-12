// backend/server.js
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(cors());
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  console.log("POST /create-checkout-session body:", req.body);
  const plan = req.body.plan;
  if (!plan) return res.status(400).json({ error: "No se envió plan" });

  // Plan gratuito: no creamos sesión en Stripe
  if (plan === "basic") {
    return res.json({ free: true });
  }

  // Precios (en centavos)
  let price;
  if (plan === "premium") price = 499;
  else if (plan === "corporate") price = 999;
  else return res.status(400).json({ error: "Plan inválido" });

  try {
    const session = await stripe.checkout.sessions.create({
      automatic_payment_methods: { enabled: true },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `${plan} Plan` },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: "payment", // pago único
      success_url: `${process.env.CLIENT_URL}/success.html`,
      cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
    });

    console.log("Stripe session created:", session.id);
    res.json({ id: session.id });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => res.send("Backend de Stripe corriendo"));
app.listen(4242, () => console.log("Servidor corriendo en http://localhost:4242"));

