const db = require("../configs/db");
const { COUPON } = require("../configs/constants");

const cartService = require("./cart.service");
const discountType = require("../models/discount-type");

exports.addCoupon = coupon => {
  if (
    isNaN(coupon.minPrice) ||
    isNaN(coupon.discount) ||
    (!coupon.minPrice || !coupon.discount)
  ) {
    throw new Error("Please enter a valid minPrice and discout");
  }

  return this.fetchAll()
    .then(coupons => {
      coupons.push(coupon);
      return this.save(coupons);
    })
    .then(() => {
      return "\nCoupon added";
    })
    .catch(err => {
      return "\nSomethings is wrong";
    });
};

//Todo move this method to cart.service
exports.applyCoupons = () => {
  let priceWithDiscounts;
  return cartService
    .getTotalAmountAfterDiscounts()
    .then(result => {
      priceWithDiscounts = result;
      return this.fetchAll();
    })
    .then(coupons => {
      let priceWithCoupons = priceWithDiscounts;
      for (const item of coupons) {
        if (item.minPrice <= priceWithDiscounts) {
          if (item.discoutType === discountType.RATE) {
            const discount = priceWithDiscounts * (item.discount / 100);
            priceWithCoupons -= discount;
          } else if (item.discoutType === discountType.AMOUNT) {
            priceWithCoupons -= item.discount;
          }
        }
      }
      return priceWithCoupons;
    })
    .then(result => {
      result = { out: "", price: result };
      result.out += "\n Coupons applied";
      result.out += "\n Price After the Coupons ..:" + result.price;
      return result;
    })
    .catch(err => {
      console.log(err);
    });
};

exports.save = coupons => {
  return db.writeFile(COUPON, coupons);
};

exports.fetchAll = () => {
  return db.readFile(COUPON);
};
