class Product {
  constructor(title, price, categoryId) {
    this.id = "product-" + new Date().toISOString();
    this.title = title;
    this.price = price;
    this.categoryId = categoryId;
  }
}

module.exports = Product;
