const model = require('../models/admissionModel');

const admission = async (customerPayload) => {
  const customerId = await model.register(customerPayload);

  return { elegivel: true };
}

module.exports = {
  admission,
};
