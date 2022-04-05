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

    it('Deve retornar o status 200', () => {
      expect(response).to.have.status(200);
    })

    it('A requisição deve retornar um json com a chave "elegivel" com o valor true', () => {
      expect(response.body.elegivel).to.be.equals(true);
    })

    it('A requisição deve retornar um json com a chave "economiaAnualDeCO2" com o valor sendo a quantidade de CO2 que será economizada em formato numérico', () => {
      expect(response.body.economiaAnualDeCO2).to.be.a('number');
    })

  });

  describe('2 - Testa quando é informado critério de elegibilidade inválido para categoria "classeDeConsumo" ', () => {

    before(async () => {
      response = await chai.request(server)
        .post('/admittance')
        .send({
          "numeroDoDocumento": "14041738806",
          "tipoDeConexao": "bifasico",
          "classeDeConsumo": "rural",
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

    it('Deve retornar o status 200', () => {
      expect(response).to.have.status(200);
    })

    it('A requisição deve retornar um json com a chave "elegivel" com o valor false', () => {
      expect(response.body.elegivel).to.be.equals(false);
    })

    it('A requisição deve retornar um json com a chave "razoesInelegibilidade" e ela deve ser um array', () => {
      expect(response.body.razoesInelegibilidade).to.be.a('array');
    })

    it('A chave "razoesInelegibilidade" deve ser um array que contem o texto: "Classe de consumo não aceita"', () => {
      expect(response.body.razoesInelegibilidade[0]).to.be.equals('Classe de consumo não aceita');
    })

  });

  describe('3 - Testa quando é informado critério de elegibilidade inválido para categoria "modalidadeTarifaria" ', () => {

    before(async () => {
      response = await chai.request(server)
        .post('/admittance')
        .send({
          "numeroDoDocumento": "13031738806",
          "tipoDeConexao": "bifasico",
          "classeDeConsumo": "industrial",
          "modalidadeTarifaria": "verde",
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

    it('Deve retornar o status 200', () => {
      expect(response).to.have.status(200);
    })

    it('A requisição deve retornar um json com a chave "elegivel" com o valor false', () => {
      expect(response.body.elegivel).to.be.equals(false);
    })

    it('A requisição deve retornar um json com a chave "razoesInelegibilidade" e ela deve ser um array', () => {
      expect(response.body.razoesInelegibilidade).to.be.a('array');
    })

    it('A chave "razoesInelegibilidade" deve ser um array que contem o texto: "Modalidade tarifária não aceita"', () => {
      expect(response.body.razoesInelegibilidade[0]).to.be.equals('Modalidade tarifária não aceita');
    })

  });

});
