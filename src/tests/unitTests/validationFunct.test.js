const functs = require('../../api/utils/validationFunct');
const customersOk = require('./mocks/customersOkMock');


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

});
