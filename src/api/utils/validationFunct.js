const joi = require('@hapi/joi');
const errHandle = require('./errHendle');

const consumptionClasses = ({ classeDeConsumo }) => {
  if (classeDeConsumo.includes('rural')
  || classeDeConsumo.includes('publico')) {
      return 'Classe de consumo não aceita';
    };
  return false;
};

const modalityTax = ({ modalidadeTarifaria }) => {
  if (modalidadeTarifaria.includes('azul')
  || modalidadeTarifaria.includes('verde')) {
    return 'Modalidade tarifária não aceita';
  };
  return false;
};

const eligibilityCriteria = (customerPayload) => {
  const log = consumptionClasses(customerPayload);
  const log2 = modalityTax(customerPayload);

  if (!log && !log2) return false;
  if (log && !log2) return [log];
  if (!log && log2) return [log2];
  return [log, log2];
};

module.exports = {
  eligibilityCriteria,
};
