class Campaign {
  constructor(categoryId, discount, minQuantity, discountType) {
    this.id = "campaign-" + new Date().toISOString();
    this.categoryId = categoryId;
    this.discount = discount;
    this.minQuantity = minQuantity;
    this.discountType = discountType;
  }
}

module.exports = Campaign;
