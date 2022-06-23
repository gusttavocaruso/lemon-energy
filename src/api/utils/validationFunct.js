const joi = require('@hapi/joi');
const errHandle = require('./errHandle');


const consumptionClasses = ({ classeDeConsumo }) => {
  if (classeDeConsumo.includes('rural')
  || classeDeConsumo.includes('poderPublico')) {
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

  if (tipoDeConexao === 'monofasico' && avaregeConsump < 400) return false; 
  if (tipoDeConexao === 'bifasico' && avaregeConsump < 500) return false;
  if (tipoDeConexao === 'trifasico' && avaregeConsump < 750) return false;

  return true;
};

const criteriaCheck = (isClassOk, isTaxOk, isConsumpOk) => {
  const nOkTax = 'Modalidade tarifária não aceita';
  const nOkClass = 'Classe de consumo não aceita';
  const nOkConsump = 'Consumo muito baixo para tipo de conexão';

  /* se a classe de consumo, a taxa tarifária e o 
  consumo minimo estão OK, retorna falso para 'is refused' */
  if (isClassOk && isTaxOk && isConsumpOk) return [];

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

  //se a classe de consumo, a taxa tarifária e o consumo minimo não estão OK:
  return [nOkClass, nOkTax, nOkConsump];
};

const customerPayloadValidation = (customerPayload) => {

  const payloadValidation = joi.object({
    numeroDoDocumento: joi.string().min(11).max(14).required(),
    tipoDeConexao: joi.string().valid('monofasico', 'bifasico', 'trifasico').required(),
    classeDeConsumo: joi.string()
      .valid('residencial', 'industrial', 'comercial', 'rural','poderPublico')
      .required(),
    modalidadeTarifaria: joi.string()
      .valid('azul', 'branca', 'verde', 'convencional')
      .required(),
    historicoDeConsumo: joi.array()
      .items(joi.number().min(0).max(9999))
      .min(3).max(12).required(),
  });

  const { error } = payloadValidation.validate(customerPayload);
  if (error) throw errHandle(404, error.message);
}

const eligibilityCriteria = (customerPayload) => {

  customerPayloadValidation(customerPayload);

  const isClassOk = consumptionClasses(customerPayload);
  const isTaxOk = modalityTax(customerPayload);
  const isConsumpOk = minConsumption(customerPayload);

  return criteriaCheck(isClassOk, isTaxOk, isConsumpOk);
};

module.exports = {
  eligibilityCriteria,
};
