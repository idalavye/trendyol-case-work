const { question } = require("../util/util-methods");

const Coupon = require("../models/coupon.model");

const discountTypeController = require("./discount-type.controller");
const couponService = require("../service/coupon.service");

exports.createCoupon = async () => {
  const minPrice = await question("Please enter a min Price:");
  const discount = await question("Please enter a discount :");
  const choiceAType = await discountTypeController.chooseDiscountType();

  const coupon = new Coupon(+minPrice, +discount, choiceAType);
  const result = await couponService.addCoupon(coupon);
  console.log(result);
};

exports.applyCoupons = async () => {
  const result = await couponService.applyCoupons();
  console.log(result.out);
};
