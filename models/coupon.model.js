class Coupon {
  constructor(minPrice, discount, discoutType) {
    this.id = "coupon-" + new Date().toISOString();
    this.minPrice = minPrice;
    this.discount = discount;
    this.discoutType = discoutType;
  }
}

module.exports = Coupon;
