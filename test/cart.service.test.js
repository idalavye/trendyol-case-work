const expect = require("chai").expect;
const sinon = require("sinon");

const db = require("../configs/db");

const deliveryService = require("../service/delivery.service");
const cartService = require("../service/cart.service");

const Product = require("../models/product.model");

describe("Cart Service", () => {
  beforeEach(done => {
    db.writeFile("cart", {
      totalPrice: 100,
      products: {
        "product-1": 5,
        "product-2": 5
      },
      categories: {
        "category-1": {
          quantity: 5,
          totalPrice: 50,
          maxDiscount: 0
        },
        "category-2": {
          quantity: 5,
          totalPrice: 50,
          maxDiscount: 0
        }
      }
    });
    done();
  });

  describe("addItem", () => {
    it("product must be added corretly to the cart", done => {
      cartService
        .addItem(new Product("Macbook Pro", 2000, "category-3"), 5)
        .then(() => {
          return cartService.fetchAll();
        })
        .then(cart => {
          expect(Object.keys(cart.products).length).to.equal(3);
          expect(cart.categories["category-3"].quantity).to.equal(5);
          done();
        })
        .catch(done);
    });

    it("if comes empty data dont save to database", done => {
      try {
        cartService.addItem(new Product());
        done();
      } catch (err) {
        cartService
          .fetchAll()
          .then(cart => {
            expect(Object.keys(cart.products)).to.have.lengthOf(2);
            done();
          })
          .catch(done);
      }
    });

    it("if quantity is not a number then throw error", done => {
      try {
        cartService.addItem(new Product("Macbook Pro", "200", "category-3"));
        done();
      } catch (err) {
        cartService
          .fetchAll()
          .then(cart => {
            expect(Object.keys(cart.products)).to.have.lengthOf(2);
            done();
          })
          .catch(done);
      }
    });
  });

  describe("saveCategoriesWithDiscounts", done => {
    it("should be save categories with discounts correctly to the database", done => {
      const categories = {
        "category-1": {
          quantity: 5,
          totalPrice: 50,
          maxDiscount: 0
        },
        "category-2": {
          quantity: 5,
          totalPrice: 50,
          maxDiscount: 0
        },
        "category-3": {
          quantity: 6,
          totalPrice: 50,
          maxDiscount: 20
        }
      };

      cartService
        .saveCategoriesWitDiscounts(categories)
        .then(() => {
          return cartService.fetchAll();
        })
        .then(cart => {
          expect(cart.categories["category-3"].maxDiscount).to.equal(20);
          done();
        })
        .catch(done);
    });

    it("if comes empty categories data dont save to database", done => {
      const categories = {};

      try {
        cartService.saveCategoriesWitDiscounts(categories);
        done();
      } catch (err) {
        cartService
          .fetchAll()
          .then(cart => {
            expect(Object.keys(cart.categories)).to.have.lengthOf(2);
            done();
          })
          .catch(done);
      }
    });
  });

  describe("getTotalAmountAfterDiscounts", () => {
    it("should be return total amount after discounts correctly", done => {
      sinon.stub(cartService, "applyDiscounts");
      cartService.applyDiscounts.returns(
        new Promise((resolve, reject) => {
          resolve({
            totalPrice: 100,
            products: {
              "product-1": 5,
              "product-2": 5
            },
            categories: {
              "category-1": {
                quantity: 5,
                totalPrice: 50,
                maxDiscount: 0
              },
              "category-2": {
                quantity: 5,
                totalPrice: 50,
                maxDiscount: 0
              }
            }
          });
        })
      );

      cartService
        .getTotalAmountAfterDiscounts()
        .then(result => {
          expect(result).to.equal(100);
          done();
        })
        .catch(done);

      cartService.applyDiscounts.restore();
    });
  });
});
