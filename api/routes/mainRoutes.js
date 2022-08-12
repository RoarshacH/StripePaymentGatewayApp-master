module.exports = function (app) {
  var main = require("../controllers/mainController");

  //Routes
  app.route("/").get(main.fetch_home);
  app.route("/products").get(main.fetch_products);
  app.route("/payment/success").get(main.fetch_home_success);
  app.route("/payment/failure").get(main.fetch_home_failure);
};
