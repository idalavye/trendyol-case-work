const discountType = require("../models/discount-type");
const { question } = require("../util/util-methods");

exports.chooseDiscountType = async () => {
  console.log("0 - Rate");
  console.log("1 - Amount");
  while (true) {
    choice = await question("Please choose discount type :");
    if (choice.toString().trim() === "0") {
      return discountType.RATE;
    } else if (choice.toString().trim() === "1") {
      return discountType.AMOUNT;
    } else {
      console.log("Please enter a valid product key....");
      continue;
    }
  }
};
