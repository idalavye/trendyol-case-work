const Category = require("../models/category.model");
const { question } = require("../util/util-methods");

const categoryService = require("../service/category.service");

exports.addCategory = async () => {
  const categoryName = await question("Please enter a category name : ");
  const category = new Category(categoryName);
  const result = await categoryService.addCategory(category);
  console.lof(result);
};

exports.selectCategory = async () => {
  const categoris = await categoryService.fetchAll();
  categoris.forEach((category, index) => {
    console.log(index + ": " + category.title);
  });

  if (categoris.length === 0) {
    console.log("\nYou must added some categories....");
    return;
  }
  while (true) {
    try {
      const choice = await question("Please chose a category...:");
      return categoris[+choice].id;
    } catch (err) {
      console.log("Please enter a valid category number");
    }
  }
};
