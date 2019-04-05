const db = require("../configs/db");

const campaignService = require("../service/campaign.service");
const discountType = require("../models/discount-type");
const productService = require("./product.service");
const categoryService = require("../service/category.service");
const couponService = require("../service/coupon.service");

exports.addItem = (product, quantity) => {
  if (!product.title || !product.price || !product.categoryId) {
    throw new Error("Empty Data");
  }

  if (isNaN(quantity)) {
    throw new Error("Product quantity must be number");
  }

  return this.fetchAll().then(cart => {
    cart.totalPrice += product.price * quantity;
    if (!cart.products[product.id]) {
      cart.products[product.id] = +quantity;
    } else {
      cart.products[product.id] += +quantity;
    }
    if (!cart.categories[product.categoryId]) {
      cart.categories[product.categoryId] = {
        quantity: +quantity,
        totalPrice: +product.price * quantity,
        maxDiscount: 0
      };
    } else {
      cart.categories[product.categoryId].quantity += +quantity;
      cart.categories[product.categoryId].totalPrice +=
        +product.price * quantity;
    }
    db.writeFile("cart", cart);
  });
};

exports.applyDiscounts = () => {
  let categories;
  return this.fetchAll()
    .then(cart => {
      categories = cart.categories;
      return campaignService.fetchAll();
    })
    .then(campaigns => {
      try {
        for (const item of campaigns) {
          //shopping cart da bu kategoride ürün varsa devam etsin
          if (categories[item.categoryId])
            if (categories[item.categoryId].quantity >= item.minQuantity) {
              if (item.discountType === discountType.RATE) {
                const discount =
                  categories[item.categoryId].totalPrice *
                  (item.discount / 100);
                if (categories[item.categoryId].maxDiscount < discount) {
                  categories[item.categoryId].maxDiscount = discount;
                }
              } else if (item.discountType === discountType.AMOUNT) {
                if (categories[item.categoryId].maxDiscount < item.discount) {
                  categories[item.categoryId].maxDiscount = item.discount;
                }
              }
            }
        }
      } catch (err) {
        const error = new Error("Somethings went wrong");
        throw error;
      }
      return this.saveCategoriesWitDiscounts(categories);
    })
    .then(() => {
      // console.log("\n Discounts applied");
    })
    .catch(err => console.log(err));
};

exports.saveCategoriesWitDiscounts = categories => {
  if (Object.keys(categories).length === 0) {
    throw new Error("Empty categories data");
  }
  return this.fetchAll()
    .then(cart => {
      cart.categories = categories;
      return this.saveCart(cart);
    })
    .catch(err => console.log(err));
};

exports.getTotalAmountAfterDiscounts = () => {
  return this.applyDiscounts()
    .then(() => {
      return this.fetchAll();
    })
    .then(cart => {
      const categories = cart.categories;
      let totalDiscount = 0;
      for (const item in categories) {
        totalDiscount += categories[item].maxDiscount;
      }
      return cart.totalPrice - totalDiscount;
    })
    .catch(err => console.log(err));
};

exports.cartPrint = () => {
  let totalPrice;
  let deliveryPrice;
  const obj = {};

  return this.fetchAll().then(async cart => {
    const products = cart.products;
    totalPrice = cart.totalPrice;
    deliveryPrice = cart.delivery;
    for (const item in products) {
      await productService.findProductById(item).then(product => {
        for (const productItem of product) {
          categoryService
            .findCategoryById(productItem.categoryId)
            .then(categoryName => {
              if (!obj[categoryName]) {
                obj[categoryName] = {
                  output: "",
                  totalPrice:
                    cart.categories[productItem.categoryId].totalPrice,
                  totalDiscount:
                    cart.categories[productItem.categoryId].maxDiscount
                };
                obj[categoryName].output =
                  "Title : " +
                  productItem.title +
                  " - " +
                  "Quantity : " +
                  cart.products[item] +
                  " - " +
                  "Unit Price : " +
                  productItem.price +
                  "\n";
              } else {
                obj[categoryName].output +=
                  "Title : " +
                  productItem.title +
                  " - " +
                  "Quantity : " +
                  cart.products[item] +
                  " - " +
                  "Unit Price : " +
                  productItem.price +
                  "\n";
              }
            });
        }
      });
    }

    return couponService.applyCoupons().then(result => {
      for (const item in obj) {
        console.log(
          "\n" +
            item +
            "\n-----------------------------------------" +
            "\n" +
            obj[item].output +
            "Total Price : " +
            obj[item].totalPrice +
            " - " +
            "Total Discount : " +
            obj[item].totalDiscount
        );
      }

      console.log(
        "\n  Total Price : " +
          totalPrice +
          " TL" +
          "\n  Total Discount (coupon,campaign): " +
          result +
          " TL" +
          "\n  Delivery Price : " +
          deliveryPrice +
          " TL" +
          "\n"
      );
    });
  });
};

exports.saveDelivery = deliveryPrice => {
  return this.fetchAll().then(cart => {
    cart.delivery = +deliveryPrice;
    return this.saveCart(cart);
  });
};

exports.saveCart = cart => {
  return db.writeFile("cart", cart);
};

exports.fetchAll = () => {
  return db.readFile("cart").then(cart => {
    if (cart.length === 0) {
      cart = { totalPrice: 0, products: {}, categories: {}, delivery: 0 };
      return cart;
    }
    return cart;
  });
};
