const db = require("../configs/db");
const { CATEGORIES } = require("../configs/constants");

exports.addCategory = category => {
  if (!category.title) {
    throw new Error("Empty Data");
  }

  return this.findCategoryByTitle(category.title).then(result => {
    if (!result) {
      return this.fetchAll()
        .then(categories => {
          categories.push(category);
          return this.writeFile(categories);
        })
        .then(() => {
          return "\n Category added";
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      return "This category is already avaible";
    }
  });
};

exports.fetchAll = () => {
  return db.readFile(CATEGORIES);
};

exports.writeFile = categories => {
  return db.writeFile(CATEGORIES, categories);
};

exports.findCategoryById = categoryId => {
  if (!categoryId) {
    throw new Error("Empty data");
  }
  try {
    return this.fetchAll().then(categories => {
      const category = categories.filter(
        category => category.id === categoryId
      );

      if (category.length === 0) {
        return null;
      }
      return category[0].title;
    });
  } catch (err) {}
};

exports.findCategoryByTitle = title => {
  if (!title) {
    throw new Error("Empty Data");
  }

  return this.fetchAll().then(categories => {
    const category = categories.filter(category => category.title === title);

    if (category.length === 0) {
      return null;
    }
    return category[0];
  });
};
