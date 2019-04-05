const expect = require("chai").expect;
const db = require("../configs/db");
const sinon = require("sinon");

const categoryService = require("../service/category.service");
const Category = require("../models/category.model");

describe("Category Service", function() {
  before(function() {
    process.mainModule.filename = __dirname;
  });

  describe("fetchall", function() {
    it("should be fetched all categories", done => {
      categoryService
        .addCategory(new Category("Apple"))
        .then(() => {
          return categoryService.fetchAll();
        })
        .then(categories => {
          expect(categories).to.have.lengthOf(1);
          done();
        })
        .catch(done);
    });
  });

  describe("addCategory", () => {
    it("categorie should be save corretly to the database", done => {
      categoryService
        .addCategory(new Category("Apple"))
        .then(() => {
          return categoryService.fetchAll();
        })
        .then(categories => {
          expect(categories[0].title).to.equal("Apple");
          done();
        })
        .catch(done);
    });

    it("dont add again if categorie title is already exist", done => {
      categoryService
        .addCategory(new Category("Apple"))
        .then(() => {
          return categoryService.addCategory(new Category("Apple"));
        })
        .then(() => {
          return categoryService.fetchAll();
        })
        .then(categories => {
          expect(categories).to.have.lengthOf(1);
          done();
        })
        .catch(done);
    });

    it("should throw an error if comes an empty data", () => {
      expect(categoryService.addCategory.bind(this, new Category())).to.throw();
    });
  });

  describe("writeFile", () => {
    it("should be write a category correctly to the database", done => {
      categoryService
        .addCategory(new Category("Apple"))
        .then(() => {
          return categoryService.fetchAll();
        })
        .then(categories => {
          expect(categories[0].title).to.equal("Apple");
          done();
        })
        .catch(done);
    });
  });

  describe("findCategoryById", done => {
    it("should be find correct category with category id", done => {
      categoryService
        .addCategory(new Category("Apple"))
        .then(() => {
          return db.readFile("categories");
        })
        .then(categories => {
          return categoryService.findCategoryById(categories[0].id);
        })
        .then(category => {
          expect(category).to.equal("Apple");
          done();
        })
        .catch(done);
    });

    it("return null if categories is does not exist", done => {
      categoryService
        .findCategoryById("some-id")
        .then(category => {
          expect(category).to.be.null;
          done();
        })
        .catch(done);
    });

    it("should throw an error if comes empty data", () => {
      expect(categoryService.findCategoryById.bind(this, null)).to.throw();
    });
  });

  describe("findCategoryByTitle", () => {
    it("should be find correct categorie with category title", done => {
      categoryService
        .addCategory(new Category("Apple"))
        .then(() => {
          return categoryService.findCategoryByTitle("Apple");
        })
        .then(category => {
          expect(category.title).to.equal("Apple");
          done();
        })
        .catch(done);
    });

    it("return null if categories is does not exist", done => {
      categoryService
        .findCategoryByTitle("some-id")
        .then(category => {
          expect(category).to.be.null;
          done();
        })
        .catch(done);
    });

    it("should throw an error if comes empty data", () => {
      expect(categoryService.findCategoryByTitle.bind(this, null)).to.throw();
    });
  });
  afterEach(function(done) {
    db.writeFile("categories", []);
    done();
  });
});
