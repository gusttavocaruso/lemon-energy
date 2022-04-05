const model = require('../models/admissionModel');
const validate = require('../utils/validationFunct');

const consumpInCO2 = ({ historicoDeConsumo }) => {
  const somaConsump = historicoDeConsumo.reduce((acc, consump) => acc + consump);
  const consumpByCO2 = (somaConsump / 1000) * 84;
  return consumpByCO2;
};

const admission = async (customerPayload) => {
  const isRefused = validate.eligibilityCriteria(customerPayload);

  if (isRefused) {
    return { elegivel: false, razoesInelegibilidade: isRefused }
  }

  await model.register(customerPayload);
  const CO2 = consumpInCO2(customerPayload);

  return { elegivel: true, economiaAnualDeCO2: CO2 };
};

module.exports = {
  admission,
};
