const db = require("../configs/db");
const { CAMPAIGNS } = require("../configs/constants");

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
    .readFile(CAMPAIGNS)
    .then(campaigns => {
      campaigns.push(campaign);
      db.writeFile(CAMPAIGNS, campaigns);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.fetchAll = () => {
  return db.readFile(CAMPAIGNS).then(campaigns => {
    return campaigns;
  });
};
