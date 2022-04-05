const model = require('../models/admissionModel');
const validate = require('../utils/validationFunct');

const admission = async (customerPayload) => {
  const isRefused = validate.eligibilityCriteria(customerPayload);

  if (isRefused) {
    return { elegivel: false, razoesInelegibilidade: isRefused }
  }

  await model.register(customerPayload);
  return { elegivel: true, economiaAnualDeCO2: 0 };
}

module.exports = {
  admission,
};
