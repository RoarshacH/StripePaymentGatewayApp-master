const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let ProductsSchema = new Schema({
  id: String,
  name: String,
  price: Number,
  imgName: String,
});

let ItemSchema = new Schema({
  name: String,
  price: Number,
  quentity: Number,
});

let CartSchema = new Schema({
  CartID: {
    type: Number,
    required: "Course ID cannot be null",
  },
  CartTotal: {
    type: String,
  },
  CartItems: {
    type: [ItemSchema],
  },
});

module.exports = mongoose.model("CartItem", ItemSchema);
module.exports = mongoose.model("Cart", CartSchema);
module.exports = mongoose.model("Products", ProductsSchema);
