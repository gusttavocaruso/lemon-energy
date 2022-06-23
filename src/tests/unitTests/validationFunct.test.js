const functs = require('../../api/utils/validationFunct');
const customersOk = require('./mocks/customersOkMock');
const customersNOk = require('./mocks/customersNOkMock');

test('Testa função \'eligibilityCriteria\' recebendo clientes com parâmetros elegíveis', () => {
    let response = Object.values(customersOk)
      .map((customer) => functs
        .eligibilityCriteria(customer));
  
    /**testa com 3 casos diferentes */
    expect(response[0]).toEqual([]);
    expect(response[1]).toEqual([]);
    expect(response[2]).toEqual([]);
  });

test('Testa função \'eligibilityCriteria\' recebendo clientes com parâmetros inelegíveis', () => {
  let response = Object.values(customersNOk)
  .map((customer) => functs
    .eligibilityCriteria(customer));

  /**testa com 3 casos diferentes */
  expect(response[0]).toContain("Classe de consumo não aceita");
  expect(response[1]).toContain("Modalidade tarifária não aceita");
  expect(response[2]).toContain("Consumo muito baixo para tipo de conexão");
});
