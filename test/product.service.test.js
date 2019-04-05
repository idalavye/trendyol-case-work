const expect = require("chai").expect;

const db = require("../configs/db");
const { PRODUCTS } = require("../configs/constants");

const productService = require("../service/product.service");
const Product = require("../models/product.model");

describe("Product Service", () => {
  before(function() {
    process.mainModule.filename = __dirname;
  });

  describe("addProduct", () => {
    it("product should be save correctly to the database", done => {
      productService
        .addProduct(new Product("Macbook Pro", 2000, "categoryId"))
        .then(() => {
          return db.readFile(PRODUCTS);
        })
        .then(products => {
          expect(products).to.have.lengthOf(1);
          expect(products[0].title).to.equal("Macbook Pro");
          expect(products[0].price).to.equal(2000);
          expect(products[0].categoryId).to.equal("categoryId");
          done();
        })
        .catch(done);
    });

    it("product price should be number otherwise throw an error", done => {
      productService
        .addProduct(new Product("Macbook Pro", 2000, "categoryId"))
        .then(() => {
          return db.readFile(PRODUCTS);
        })
        .then(products => {
          expect(products[0].price).to.be.a("number");
          done();
        })
        .catch(done);
    });

    it("if comes empty data dont save to database", done => {
      try {
        productService.addProduct(new Product());
      } catch (err) {
        productService
          .fetchAll()
          .then(products => {
            expect(products).to.have.lengthOf(0);
            done();
          })
          .catch(done);
      }
    });
  });

  describe("findProductById", () => {
    it("should be find correct categorie with category title", done => {
      productService
        .addProduct(new Product("Macbook Pro", 2000, "categoryId"))
        .then(() => {
          return db.readFile(PRODUCTS);
        })
        .then(products => {
          return productService.findProductById(products[0].id);
        })
        .then(product => {
          expect(product[0].title).to.equal("Macbook Pro");
          expect(product[0].price).to.equal(2000);
          expect(product[0].categoryId).to.equal("categoryId");
          done();
        })
        .catch(done);
    });

    it("return null if product is not exist", done => {
      productService
        .findProductById("some-id")
        .then(product => {
          expect(product).to.be.null;
          done();
        })
        .catch(done);
    });
  });
  describe("fetchAll", () => {
    it("should be fetched all products", done => {
      productService
        .addProduct(new Product("Macbook Pro", 2000, "categoryId"))
        .then(() => {
          return db.readFile(PRODUCTS);
        })
        .then(products => {
          expect(products).to.be.lengthOf(1);
          done();
        })
        .catch(done);
    });
  });

  describe("writeFile", () => {
    it("product should be save to database", done => {
      let array = [new Product("Macbook Pro", 2000, "categoryId")];
      productService
        .writeFile(array)
        .then(() => {
          return db.readFile(PRODUCTS);
        })
        .then(products => {
          expect(products[0].title).to.equal("Macbook Pro");
          expect(products[0].price).to.equal(2000);
          expect(products[0].categoryId).to.equal("categoryId");
          done();
        })
        .catch(done);
    });
  });

  afterEach(done => {
    db.writeFile(PRODUCTS, []);
    done();
  });
});
