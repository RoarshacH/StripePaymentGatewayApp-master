module.exports = function (app) {
  var carts = require("../controllers/cartController");

  //Routes
  app.route("/cart").get(carts.get_my_cart).delete(carts.remove_cart);
  app.route("/cart/items").post(carts.add_item_to_cart).delete(carts.remove_item_from_cart);
  app.route("/payment").post(carts.stripe_checkout);
};
