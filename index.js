const express = require("express");
const bodyParser = require("body-parser");
const InitiateMongoServer = require("./db");

require("dotenv").config();
InitiateMongoServer();

var Cart = require("./api/model/cartModel");

const app = express();
// Ejs and bodyParser
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static("public"));

// OAuth
const { auth, requiresAuth } = require("express-openid-connect");
app.use(
  auth({
    authRequired: false,
    auth0Logout: true,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    secret: process.env.SECRET,
  })
);

// Stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET);

var cartRoutes = require("./api/routes/cartRoutes");
var mainRoutes = require("./api/routes/mainRoutes");

mainRoutes(app);
cartRoutes(app);

app.listen(3000, function () {
  console.log("Server online at port 3000");
});
