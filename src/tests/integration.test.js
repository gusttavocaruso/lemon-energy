const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const server = require('../api/server');
const mongodb = require('mongodb').MongoClient;
const { getConnection } = require('./connectionMock');

chai.use(chaiHttp);
const { expect } = chai;


let connectionMock;
before(async () => {
  connectionMock = await getConnection();
  sinon.stub(mongodb, 'connect').resolves(connectionMock);
});
after(() => { mongodb.connect.restore() });


describe('Critérios de Elegibilidade de Cliente ', () => {
  let response;

  describe('1 - Testa quando são informados critérios de elegibilidade válidos para aprovação de um cliente ', () => {

    before(async () => {
      response = await chai.request(server)
        .post('/admittance')
        .send({
          "numeroDoDocumento": "14041737706",
          "tipoDeConexao": "bifasico",
          "classeDeConsumo": "comercial",
          "modalidadeTarifaria": "convencional",
          "historicoDeConsumo": [
            3878,
            9760,
            5976,
            2797,
            2481,
            5731,
            7538,
            4392,
            7859,
            4160,
            6941,
            4597
          ]
        });
    });

    it('Deve retornar o status 201', () => {
      expect(response).to.have.status(201);
    })

    // it('A requisição deve retornar a mensagem: Account has been created sucessfuly', () => {
    //   expect(response.body.message).to.be.equals('Account has been created sucessfuly');
    // })

  });

});
