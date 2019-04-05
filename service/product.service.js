const db = require("../configs/db");
const { PRODUCTS } = require("../configs/constants");

exports.addProduct = product => {
  if (isNaN(product.price) || !product.price) {
    throw new Error("Please enter a valid price");
  }

  return this.fetchAll()
    .then(products => {
      products.push(product);
      this.writeFile(products);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.findProductById = productId => {
  return this.fetchAll().then(products => {
    const product = products.filter(product => product.id === productId);

    if (product.length === 0) {
      return null;
    }
    return product;
  });
};

exports.fetchAll = () => {
  return db.readFile(PRODUCTS);
};

exports.writeFile = product => {
  return db.writeFile(PRODUCTS, product);
};
