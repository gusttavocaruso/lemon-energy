const joi = require('@hapi/joi');
const errHandle = require('./errHendle');

const consumptionClasses = ({ classeDeConsumo }) => {
  if (classeDeConsumo.includes('rural')
  || classeDeConsumo.includes('publico')) {
      return false;
    };
  return true;
};

const modalityTax = ({ modalidadeTarifaria }) => {
  if (modalidadeTarifaria.includes('azul')
  || modalidadeTarifaria.includes('verde')) {
    return false;
  };
  return true;
};

const eligibilityCriteria = (customerPayload) => {
  const isOkClasses = consumptionClasses(customerPayload);
  const isOkTax = modalityTax(customerPayload);

  const nOkTax = 'Modalidade tarifária não aceita'
  const nOkClass = 'Classe de consumo não aceita'

  //se a classe de consumo e a taxa tarifária estão OK, retorna falso para 'is refused'
  if (isOkClasses && isOkTax) return false;
  if (!isOkClasses && isOkTax) return [nOkClass];
  if (isOkClasses && !isOkTax) return [nOkTax];

  return [nOkClass, nOkTax];
};

module.exports = {
  eligibilityCriteria,
};
