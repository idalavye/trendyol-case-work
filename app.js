const { question } = require("./util/util-methods");

const productController = require("./controllers/product.controller");
const categoryController = require("./controllers/category.controller");
const campaignController = require("./controllers/campaign.controller");
const cartController = require("./controllers/shopping-cart.controller");
const couponController = require("./controllers/coupon.controller");
const deliveryController = require("./controllers/delivery.controller");

console.log("*********************************************");
console.log("********  Welcome to E-Commerce App  ********");
console.log("*********************************************\n");

const showMenu = () => {
  console.log("\n1 - Add Product");
  console.log("2 - Show All Products");
  console.log("3 - Add Category");
  console.log("4 - Add Campaign");
  console.log("5 - Apply Discounts");
  console.log("6 - Add Coupon");
  console.log("7 - Apply Coupons");
  console.log("8 - Calculate Delivery");
  console.log("9 - Print Cart");
  console.log("e - Exit\n");
};

(async function main() {
  try {
    var answer = "default";
    while (true) {
      showMenu();
      answer = await question("Please choice on...: ");
      switch (answer.toString().trim()) {
        case "1":
          await productController.addProduct();
          break;
        case "2":
          await productController.showAllProducts();
          break;
        case "3":
          await categoryController.addCategory();
          break;
        case "4":
          await campaignController.createCampaign();
          break;
        case "5":
          await cartController.applyDiscounts();
          break;
        case "6":
          await couponController.createCoupon();
          break;
        case "7":
          await couponController.applyCoupons();
          break;
        case "8":
          await deliveryController.deliveryCostCalculate();
          break;
        case "9":
          await cartController.printCart();
          break;
        case "e":
          process.exit();
      }
    }
  } catch (err) {
    console.log("\n" + err.message + "\n");
    console.log("Somethins is wrong!! Please restart again");
    process.exit();
  }
})();
