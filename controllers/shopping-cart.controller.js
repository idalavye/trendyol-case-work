const { question } = require("../util/util-methods");

const cartService = require("../service/cart.service");
const deliveryController = require("../controllers/delivery.controller");

exports.addToProductShoppingCart = async (product, amount) => {
  if (amount !== 0) await cartService.addItem(product, amount);
};

exports.applyDiscounts = async () => {
  const result = await cartService.applyDiscounts();
  console.log(result);
};

exports.printCart = async () => {
  console.log("\nPlease firstly calculate the delivery.... \n");
  await deliveryController.deliveryCostCalculate();
  await cartService.cartPrint();
};
