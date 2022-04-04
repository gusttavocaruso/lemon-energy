const model = require('../models/admissionModel');

const admission = async (customerPayload) => {
  const customerId = await model.register(customerPayload);

  return customerId;
}

module.exports = {
  admission,
};
