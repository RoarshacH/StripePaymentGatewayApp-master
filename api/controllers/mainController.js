const stripe = require("stripe")(process.env.STRIPE_SECRET);
var mongoose = require("mongoose");
require("dotenv").config();
const Products = mongoose.model("Products");
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}

exports.fetch_home = (req, res) => {
  res.render("home", { title: "Shopping App", auth: req.oidc.isAuthenticated() ? "Logged in" : "Logged out" });
};

exports.fetch_products = (req, res) => {
  Products.find({}, (err, task) => {
    if (err) {
      res.status(500).end();
    }
    res.render("products", {
      stripePublicKey: process.env.STRIPE_KEY,
      items: task,
      title: "Products Page",
    });
  });
  // res.render("products", { title: "Products Page" });
};

exports.start_stripe_payment = (req, res) => {
  // We are not using this Route check in cartController
  // Moreover you can take more details from user
  // like Address, Name, etc from form
  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
      name: "Test User",
      address: {
        line1: "TC Barrie",
        postal_code: "L4M 0A3",
        city: "Barrie",
        state: "Ontario",
        country: "Canada",
      },
    })
    .then((customer) => {
      return stripe.charges.create({
        amount: 2000, // Charing money
        description: "Web Development Product",
        currency: "CAD",
        customer: customer.id,
      });
    })
    .then((charge) => {
      res.send("Success"); // If no error occurs
    })
    .catch((err) => {
      res.send(err); // If some error occurs
    });
};

exports.fetch_home_failure = (req, res) => {
  res.render("result", { title: "Payment Result", result: "Your Payment Failed" });
};

exports.fetch_home_success = (req, res) => {
  localStorage.removeItem("cart");
  res.render("result", { title: "Payment Result", result: "Your Payment was Successfull" });
};
