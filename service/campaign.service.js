const db = require("../configs/db");

exports.save = campaign => {
  if (
    !campaign.categoryId ||
    !campaign.discount ||
    !campaign.minQuantity ||
    !campaign.discountType
  ) {
    const error = new Error("Empty Data");
    error.statusCode = 500;
    throw error;
  }

  if (isNaN(campaign.discount) || isNaN(campaign.minQuantity)) {
    throw new Error("Please enter a valid minQuantity and discout");
  }

  return db
    .readFile("campaigns")
    .then(campaigns => {
      campaigns.push(campaign);
      db.writeFile("campaigns", campaigns);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.fetchAll = () => {
  return db.readFile("campaigns").then(campaigns => {
    return campaigns;
  });
};
