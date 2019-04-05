const { question } = require("../util/util-methods");

const Campaign = require("../models/campaign.model");

const campaignService = require("../service/campaign.service");
const categoryController = require("../controllers/category.controller");
const discountTypeController = require("../controllers/discount-type.controller");

exports.createCampaign = async () => {
  const categoryId = await categoryController.selectCategory();
  const rate = await question("Please enter a discount rate  :");
  const amount = await question("Please enter a minimum product amount :");
  const choiceAType = await discountTypeController.chooseDiscountType();

  const campaign = new Campaign(categoryId, +rate, +amount, choiceAType);
  campaignService.save(campaign);
  console.log("\n Campaign is added");
};
