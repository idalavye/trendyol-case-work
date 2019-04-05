const { question } = require("../util/util-methods");
const deliveryService = require("../service/delivery.service");

exports.deliveryCostCalculate = async () => {
  const costPerDelivery = await question(
    "Please enter a cost for per delivery : "
  );
  const costPerProduct = await question(
    "Please enter a cost for per product : "
  );

  const fixedCost = await question("Please enter a fixedCost(Smp: 2.99) : ");

  await deliveryService.calculateForCart(
    costPerDelivery,
    costPerProduct,
    fixedCost
  );
};
