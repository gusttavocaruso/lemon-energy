const model = require('../models/admissionModel');

const admission = async (customerPayload) => {
  const customerId = await model.register(customerPayload);

  return { elegivel: true, economiaAnualDeCO2: 0 };
}

module.exports = {
  admission,
};
