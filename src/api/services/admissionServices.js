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

  const CO2 = consumpInCO2(customerPayload);
  await model.register(customerPayload, CO2);

  return { elegivel: true, economiaAnualDeCO2: CO2 };
};

module.exports = {
  admission,
};
