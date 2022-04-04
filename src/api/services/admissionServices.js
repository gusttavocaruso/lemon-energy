const model = require('../models/admissionModel');
const validate = require('../utils/validationFunct');

const admission = async (customerPayload) => {
  const x = validate.eligibilityCriteria(customerPayload);
  console.log(x);


  const customerId = await model.register(customerPayload);

  return { elegivel: true, economiaAnualDeCO2: 0 };
}

module.exports = {
  admission,
};
