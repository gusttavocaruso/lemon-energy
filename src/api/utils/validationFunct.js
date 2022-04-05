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

const minConsumption = ({ tipoDeConexao, historicoDeConsumo }) => {
  const somaConsump = historicoDeConsumo.reduce((acc, consump) => acc + consump);
  const avaregeConsump = somaConsump / historicoDeConsumo.length;
  console.log(avaregeConsump);

  if (tipoDeConexao === 'monofasico' && avaregeConsump < 400) return false; 
  if (tipoDeConexao === 'bifasico' && avaregeConsump < 500) return false;
  if (tipoDeConexao === 'trifasico' && avaregeConsump < 750) return false;

  return true;
}

const eligibilityCriteria = (customerPayload) => {
  const isClassOk = consumptionClasses(customerPayload);
  const isTaxOk = modalityTax(customerPayload);
  const isConsumpOk = minConsumption(customerPayload);

  const nOkTax = 'Modalidade tarifária não aceita';
  const nOkClass = 'Classe de consumo não aceita';
  const nOkConsump = 'Consumo muito baixo para tipo de conexão';

  //se a classe de consumo e a taxa tarifária estão OK,
  // retorna falso para 'is refused'
  if (isClassOk && isTaxOk && isConsumpOk) return false;

  //se a classe de consumo não estiver OK:
  if (!isClassOk && isTaxOk && isConsumpOk) return [nOkClass];

  //se a modalidade tarifária não estiver OK: 
  if (isClassOk && !isTaxOk && isConsumpOk) return [nOkTax];

  //se o consumo minimo não estiver OK:
  if (isClassOk && isTaxOk && !isConsumpOk) return [nOkConsump];

  //se a classe de consumo e a modalidade tarifaria não estiverem OK
  //mas o consumo minimo sim.
  if (!isClassOk && !isTaxOk && isConsumpOk) return [nOkClass, nOkTax];

  //se a classe de consumo e o consumo minimo não estiverem OK
  //mas a modalidade tarifaria sim.
  if (!isClassOk && isTaxOk && !isConsumpOk) return [nOkClass, nOkConsump];

  //se a modalidade tarifaria e o consumo minimo não estiverem OK
  //mas a classe de consumo sim.
  if (isClassOk && !isTaxOk && !isConsumpOk) return [nOkTax, nOkConsump];

  return [nOkClass, nOkTax, nOkConsump];
};

module.exports = {
  eligibilityCriteria,
};
