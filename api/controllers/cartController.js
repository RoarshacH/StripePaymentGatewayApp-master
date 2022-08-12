const stripe = require("stripe")(process.env.STRIPE_SECRET);
require("dotenv").config();

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}

exports.get_my_cart = (req, res) => {
  console.log(localStorage.getItem("cart"));
  if (localStorage.getItem("cart")) {
    var cart = JSON.parse(localStorage.getItem("cart"));
    res.render("cart", { title: "My Cart", stripeKey: process.env.STRIPE_KEY, cart: cart });
  } else {
    res.render("cart", { title: "My Cart", stripeKey: process.env.STRIPE_KEY, cart: undefined });
  }
};

exports.remove_item_from_cart = (req, res) => {
  var item = { id: req.body.id, name: req.body.name, price: req.body.price };
  console.log(item);
  removeFromCart(item);
  res.json({ msg: `Hello ${req.body.item}` });
};

exports.add_item_to_cart = (req, res) => {
  var item = { id: req.body.id, name: req.body.name, price: req.body.price };
  console.log(item);
  addToCart(item);

  res.json({ msg: `Hello ${req.body.name}` });
};

exports.remove_cart = (req, res) => {
  removeCart();
  res.json({ msg: `Cart Removed` });
};

exports.stripe_checkout = async (req, res) => {
  if (localStorage.getItem("cart")) {
    var cart = JSON.parse(localStorage.getItem("cart"));
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: cart.items.map((item) => {
          return {
            price_data: {
              currency: "cad",
              product_data: {
                name: item.name,
              },
              unit_amount: item.price * 100,
            },
            quantity: item.quentity,
          };
        }),
        success_url: `${process.env.CLIENT_URL}/payment/success`,
        cancel_url: `${process.env.CLIENT_URL}/payment/failure`,
      });
      res.json({ url: session.url });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  } else {
    res.status(500).json({ error: "No Cart Creted. Please Add Items to your Cart" });
  }
};

function addToCart(newItem) {
  var itemFound = false;
  if (localStorage.getItem("cart")) {
    var newCart = JSON.parse(localStorage.getItem("cart"));
    newCart.items.forEach((element) => {
      if (element.id === newItem.id) {
        itemFound = true;
        element.quentity = element.quentity + 1;
        newCart.total = newCart.total + newItem.price;
        localStorage.setItem("cart", JSON.stringify(newCart));
        console.log("Qty Updated" + localStorage.getItem("cart"));
        return;
      }
    });
    if (!itemFound) {
      newCart["items"].push({ id: newItem.id, name: newItem.name, price: newItem.price, quentity: 1 });
      newCart.total = newCart.total + newItem.price;
      localStorage.setItem("cart", JSON.stringify(newCart));
      console.log("New Item Added" + localStorage.getItem("cart"));
      return;
    }
  } else {
    console.log("Create Cart Here");
    var obj = { items: [], total: 0.0, username: "Test User" };
    obj["items"].push({ id: newItem.id, name: newItem.name, price: newItem.price, quentity: 1 });
    obj.total = newItem.price;
    localStorage.setItem("cart", JSON.stringify(obj));
    console.log("Created Cart " + JSON.stringify(obj));
  }
}

function removeFromCart(newItem) {
  var itemFound = false;
  if (localStorage.getItem("cart")) {
    var newCart = JSON.parse(localStorage.getItem("cart"));
    newCart.items.forEach((element) => {
      if (element.id === newItem.id) {
        itemFound = true;
        element.quentity = element.quentity - 1;
        newCart.items = newCart.items.filter((data) => data.id !== newItem.id);
        newCart.total = newCart.total - element.price;
        if (element.quentity <= 0) {
          newCart.items = newCart.items.filter((data) => data.id !== newItem.id);
        }
        localStorage.setItem("cart", JSON.stringify(newCart));
        console.log("Qty Updated" + localStorage.getItem("cart"));
        return;
      }
    });
    if (!itemFound) {
      console.log("You Dont Have this item in the cart");
      return;
    }
  } else {
    console.log("You Dont Have items in the cart");
  }
}

function removeCart() {
  localStorage.removeItem("cart");
  if (localStorage.getItem("cart")) {
    console.log(localStorage.getItem("cart"));
  } else {
    console.log("No Cart Here");
  }
}
