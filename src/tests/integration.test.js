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

  describe('4 - Testa quando é informado critério de elegibilidade inválido para categoria "consumo mínimo" ', () => {

    before(async () => {
      response = await chai.request(server)
        .post('/admittance')
        .send({
          "numeroDoDocumento": "24031738806",
          "tipoDeConexao": "trifasico",
          "classeDeConsumo": "industrial",
          "modalidadeTarifaria": "branca",
          "historicoDeConsumo": [
            387,
            176,
            597,
            279,
            248,
            573,
            553,
            439,
            785,
            416,
            294,
            459
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

    it('A chave "razoesInelegibilidade" deve ser um array que contem o texto: "Consumo muito baixo para tipo de conexão"', () => {
      expect(response.body.razoesInelegibilidade[0]).to.be.equals('Consumo muito baixo para tipo de conexão');
    })

  });

  describe('5 - Testa quando são informados critérios de elegibilidade inválidos para as categorias "classeDeConsumo" & "modalidadeTarifaria" ', () => {

    before(async () => {
      response = await chai.request(server)
        .post('/admittance')
        .send({
          "numeroDoDocumento": "23031738808",
          "tipoDeConexao": "bifasico",
          "classeDeConsumo": "poderPublico",
          "modalidadeTarifaria": "azul",
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

    it('A chave "razoesInelegibilidade" deve ser um array com comprimento de 2 itens', () => {
      expect(response.body.razoesInelegibilidade).to.have.a.lengthOf(2);
    })

    it('A chave "razoesInelegibilidade" deve ser um array que contem os textos: "Classe de consumo não aceita" & "Modalidade tarifária não aceita"', () => {
      expect(response.body.razoesInelegibilidade[0]).to.be.equals('Classe de consumo não aceita');
      expect(response.body.razoesInelegibilidade[1]).to.be.equals('Modalidade tarifária não aceita');
    })

  });

  describe('6 - Testa quando são informados critérios de elegibilidade inválidos para as categorias "classeDeConsumo" & "consumo mínimo" ', () => {

    before(async () => {
      response = await chai.request(server)
        .post('/admittance')
        .send({
          "numeroDoDocumento": "24031738806",
          "tipoDeConexao": "trifasico",
          "classeDeConsumo": "rural",
          "modalidadeTarifaria": "branca",
          "historicoDeConsumo": [
            387,
            176,
            597,
            279,
            248,
            573,
            553,
            439,
            785,
            416,
            294,
            459
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

    it('A chave "razoesInelegibilidade" deve ser um array com comprimento de 2 itens', () => {
      expect(response.body.razoesInelegibilidade).to.have.a.lengthOf(2);
    })

    it('A chave "razoesInelegibilidade" deve ser um array que contem os textos: "Consumo muito baixo para tipo de conexão"', () => {
      expect(response.body.razoesInelegibilidade[0]).to.be.equals('Classe de consumo não aceita');
      expect(response.body.razoesInelegibilidade[1]).to.be.equals('Consumo muito baixo para tipo de conexão');
    })

  });

  describe('7 - Testa quando são informados critérios de elegibilidade inválidos para as categorias "modalidadeTarifaria" & "consumo mínimo" ', () => {

    before(async () => {
      response = await chai.request(server)
        .post('/admittance')
        .send({
          "numeroDoDocumento": "24031766806",
          "tipoDeConexao": "trifasico",
          "classeDeConsumo": "residencial",
          "modalidadeTarifaria": "verde",
          "historicoDeConsumo": [
            387,
            176,
            597,
            279,
            248,
            573,
            553,
            439,
            785,
            416,
            294,
            459
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

    it('A chave "razoesInelegibilidade" deve ser um array com comprimento de 2 itens', () => {
      expect(response.body.razoesInelegibilidade).to.have.a.lengthOf(2);
    })

    it('A chave "razoesInelegibilidade" deve ser um array que contem os textos: "Modalidade tarifária não aceita" & "Consumo muito baixo para tipo de conexão"', () => {
      expect(response.body.razoesInelegibilidade[0]).to.be.equals('Modalidade tarifária não aceita');
      expect(response.body.razoesInelegibilidade[1]).to.be.equals('Consumo muito baixo para tipo de conexão');
    })

  });

  describe('8 - Testa quando são informados critérios de elegibilidade inválidos para as categorias "classeDeConsumo", "modalidadeTarifaria" & "consumo mínimo" ', () => {

    before(async () => {
      response = await chai.request(server)
        .post('/admittance')
        .send({
          "numeroDoDocumento": "24031766806",
          "tipoDeConexao": "trifasico",
          "classeDeConsumo": "poderPublico",
          "modalidadeTarifaria": "azul",
          "historicoDeConsumo": [
            387,
            176,
            597,
            279,
            248,
            573,
            553,
            439,
            785,
            416,
            294,
            459
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

    it('A chave "razoesInelegibilidade" deve ser um array com comprimento de 2 itens', () => {
      expect(response.body.razoesInelegibilidade).to.have.a.lengthOf(3);
    })

    it('A chave "razoesInelegibilidade" deve ser um array que contem os textos: "Classe de consumo não aceita", "Modalidade tarifária não aceita" & "Consumo muito baixo para tipo de conexão" ', () => {
      expect(response.body.razoesInelegibilidade[0]).to.be.equals('Classe de consumo não aceita');
      expect(response.body.razoesInelegibilidade[1]).to.be.equals('Modalidade tarifária não aceita');
      expect(response.body.razoesInelegibilidade[2]).to.be.equals('Consumo muito baixo para tipo de conexão');
    })

  });

});
