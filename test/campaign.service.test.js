const expect = require("chai").expect;

const db = require("../configs/db");

const campaignService = require("../service/campaign.service");
const Campaign = require("../models/campaign.model");

describe("Campaign Service", function() {
  before(function() {
    process.mainModule.filename = __dirname;
  });

  describe("save", function() {
    it("campaign should be save correctly to the database", done => {
      campaignService
        .save(new Campaign("categoryId", 50, 5, "rate"))
        .then(() => {
          return campaignService.fetchAll();
        })
        .then(campaigns => {
          expect(campaigns).to.have.lengthOf(1);
          expect(campaigns[0].categoryId).to.equal("categoryId");
          expect(campaigns[0].discount).not.equal(75);
          done();
        })
        .catch(done);
    });

    it("shold throw an error if comes an empty data", done => {
      expect(
        campaignService.save.bind(this, new Campaign("sdfg00", "adsf", "dsf"))
      ).to.throw();
      done();
    });

    it("campaign minquantity and discount should be number otherwise throw error", done => {
      campaignService
        .save(new Campaign("categoryId", 50, 5, "rate"))
        .then(() => {
          return db.readFile("campaigns").then(campaigns => {
            expect(campaigns[0].discount).to.be.a("number");
            expect(campaigns[0].minQuantity).to.be.a("number");
            done();
          });
        })
        .catch(done);
    });
  });

  describe("fetchAll", function() {
    it("should be fetched all campaigns", done => {
      campaignService
        .save(new Campaign("categoryId", 50, 5, "rate"))
        .then(() => {
          return db.readFile("campaigns").then(campaigns => {
            expect(campaigns).to.have.lengthOf(1);
            done();
          });
        })
        .catch(done);
    });
  });
  afterEach(function(done) {
    db.writeFile("campaigns", []);
    done();
  });
});
