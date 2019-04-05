class Category {
  constructor(title, parentCategory = null) {
    this.id = "category-" + new Date().toISOString();
    this.title = title;
    this.parentCategory = parentCategory;
  }
}

module.exports = Category;
