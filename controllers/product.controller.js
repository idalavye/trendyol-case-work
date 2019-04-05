const { question } = require("../util/util-methods");

const Product = require("../models/product.model");

const productService = require("../service/product.service");
const categoryController = require("../controllers/category.controller");
const shoppingCartController = require("../controllers/shopping-cart.controller");
const categoryService = require("../service/category.service");

exports.addProduct = async () => {
  const productName = await question("\nPlease Enter a Product Name : ");
  const productPrice = await question("Please Enter a Product Price : ");
  const categoryId = await categoryController.selectCategory();

  const product = new Product(productName, productPrice, categoryId);
  productService.addProduct(product);

  console.log("\n Product added");
};

exports.showAllProducts = async () => {
  const products = await productService.fetchAll();

  let index = 0;
  for (const item of products) {
    const title = await categoryService.findCategoryById(item.categoryId);
    console.log(
      index +
        ": " +
        item.title +
        ", Price:" +
        item.price +
        ", Category: " +
        title
    );
    index++;
  }

  let choice;
  while (true) {
    choice = await question("Please select a product : ");
    if (products[+choice]) {
      break;
    } else {
      console.log("Please enter a valid product key....");
      continue;
    }
  }
  const amount = await question("Please enter a count : ");

  await shoppingCartController.addToProductShoppingCart(
    products[+choice],
    amount
  );
  console.log("\nProduct added to shopping cart");
};
