const cartService = require("../service/cart.service");

const cartController = require("../service/cart.service");

exports.calculateForCart = (costPerDelivery, costPerProduct, fixedCost) => {
  return cartService.fetchAll().then(cart => {
    const numberOfProducts = Object.keys(cart.products).length;
    const numberOfDeliveries = Object.keys(cart.categories).length;

    let deliveryPrice =
      +costPerDelivery * numberOfDeliveries +
      +costPerProduct * numberOfProducts +
      +fixedCost;

    return cartController.saveDelivery(deliveryPrice).then(() => {
      const res = { out: "", price: deliveryPrice };
      res.out = "\nDeliveryPrice : " + deliveryPrice + " TL";
      return res;
    });
  });
};
