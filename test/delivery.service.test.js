const expect = require("chai").expect;
const sinon = require("sinon");

const deliveryService = require("../service/delivery.service");
const cartService = require("../service/cart.service");

describe("Delivery Service", () => {
  describe("calculateForCart", () => {
    it("should be calculate correctly", done => {
      sinon.stub(cartService, "fetchAll");
      cartService.fetchAll.returns(
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
      deliveryService
        .calculateForCart(10, 10, 5)
        .then(result => {
          expect(result.price).to.equal(45);
          done();
        })
        .catch(done);

      cartService.fetchAll.restore();
    });
  });
});
