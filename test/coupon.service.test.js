const expect = require("chai").expect;
const sinon = require("sinon");

const db = require("../configs/db");

const couponService = require("../service/coupon.service");
const cartService = require("../service/cart.service");
const Coupon = require("../models/coupon.model");

describe("Coupon Service", function() {
  before(function() {
    process.mainModule.filename = __dirname;
  });

  describe("save", () => {
    it("coupons should be save to the database", done => {
      let array = [];
      array.push(new Coupon(100, 50, "rate"));
      couponService
        .save(array)
        .then(() => {
          return couponService.fetchAll();
        })
        .then(coupons => {
          expect(coupons).to.have.lengthOf(1);
          done();
        })
        .catch(done);
    });
  });

  describe("fetchAll", done => {
    it("should be fetched all categories", done => {
      let array = [new Coupon(100, 50, "rate")];
      couponService
        .save(array)
        .then(() => {
          return couponService.fetchAll();
        })
        .then(coupons => {
          expect(coupons).to.have.lengthOf(1);
          done();
        })
        .catch(done);
    });

    it("should be return empty array if coupons does not exists", done => {
      couponService
        .fetchAll()
        .then(coupons => {
          expect(coupons).to.be.an("array").that.is.empty;
          done();
        })
        .catch(done);
    });
  });

  describe("addCoupon", () => {
    it("coupon should be save correctly to the database", done => {
      couponService
        .addCoupon(new Coupon(100, 50, "rate"))
        .then(() => {
          return couponService.fetchAll();
        })
        .then(coupons => {
          expect(coupons).to.have.lengthOf(1);
          expect(coupons[0].minPrice).to.equal(100);
          expect(coupons[0].discount).to.equal(50);
          expect(coupons[0].discoutType).to.equal("rate");
          done();
        })
        .catch(done);
    });

    it("should throw an error if comes to empty data", done => {
      expect(couponService.addCoupon.bind(this)).to.throw;
      done();
    });

    it("minPrice and discount should be number otherwise throw an error", done => {
      couponService
        .addCoupon(new Coupon(100, 20, "rate"))
        .then(() => {
          return couponService.fetchAll();
        })
        .then(coupons => {
          expect(coupons[0].minPrice).to.be.a("number");
          expect(coupons[0].discount).to.be.a("number");
          done();
        })
        .catch(done);
    });
  });

  describe("applyCoupons", () => {
    it("coupons must be applied correctly", done => {
      sinon.stub(cartService, "getTotalAmountAfterDiscounts");
      cartService.getTotalAmountAfterDiscounts.returns(
        new Promise((resolve, reject) => {
          resolve(200);
        })
      );
      couponService
        .addCoupon(new Coupon(250, 100, "amount"))
        .then(() => {
          return couponService.applyCoupons();
        })
        .then(result => {
          expect(result.price).to.equal(200);
          cartService.getTotalAmountAfterDiscounts.restore();
          done();
        })
        .catch(done);
    });
  });
  afterEach(done => {
    db.writeFile("coupons", []);
    done();
  });
});
