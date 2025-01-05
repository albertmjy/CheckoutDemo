const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.static("public"));
app.use(express.json());

// Insert your secret key here
const SECRET_KEY = "sk_sbox_txpyg4zdo4pvb42jiag4dp4qcye"//"sk_sbox_fzitdowg7r7napn7kmcwfldzamj";

app.post("/create-payment-sessions", async (_req, res) => {
  const buyerCountry = _req.query.country
  console.log("country,", buyerCountry)

  const translations = {
    en: {
      'form.required': 'Please provide this field',
      'pay': 'Pay now',
      'pay_button.payment_failed': 'Payment failed, please try again',
    },
  };

  // Create a PaymentSession
  const request = await fetch(
    "https://api.sandbox.checkout.com/payment-sessions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        
        amount: 6540,
        currency: "EUR",
        reference: "ORD-123A",
        description: "Payment for Guitars and Amps",

        // locale: 'zh-CN',
        enabled_payment_methods:[
          "alipay_cn", "alipay_hk", "applepay", "bancontact", "benefit", "card", "dana", "eps", "gcash", "googlepay", "ideal", "kakaopay", "klarna", "knet", "multibanco", "p24", "paypal", "qpay", "sepa", "sofort", "stcpay", "tng", "truemoney"
          ],
        '3ds': {
          "enabled": true,
          "challenge_indicator": "challenge_requested"
        },
        "payment_type": "Regular",

        billing_descriptor: {
          name: "Albert Ma",
          city: "London",
        },
        customer: {
          email: "albert.ma@example.com",
          name: "Albert Ma",
        },
        shipping: {
          address: {
            address_line1: "123 High St.",
            address_line2: "Flat 456",
            city: "London",
            zip: "SW1A 1AA",
            country: "GB",
          },
          phone: {
            number: "1234567890",
            country_code: "+44",
          },
        },
        billing: {
          address: {
            address_line1: "123 High St.",
            address_line2: "Flat 456",
            city: "London",
            zip: "SW1A 1AA",
            country: buyerCountry,
          },
          phone: {
            number: "1234567890",
            country_code: "+44",
          },
        },
        risk: {
          enabled: true,
        },
        success_url: "http://localhost:3000/?status=succeeded",
        failure_url: "http://localhost:3000/?status=failed",
        metadata: {},
        "processing_channel_id": "pc_2vhgz2ikd6hele43rwcgvwuqju",//"pc_u3iplwlrpatudb7nu2erbzeczy",
        items: [
          {
            name: "iphone 16",
            quantity: 1,
            unit_price: 1635,
          },
          {
            name: "iphone 16 pro",
            quantity: 3,
            unit_price: 1635,
          },
        ],
      }),
    }
  );

  const parsedPayload = await request.json();

  res.status(request.status).send(parsedPayload);
});

app.listen(3000, () =>
  console.log("Node server listening on port 3000: http://localhost:3000/")
);
