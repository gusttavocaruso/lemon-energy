<div align="center">

# Eligibilidade para aquisição de novos cliente


Esse repositório contém o código fonte em Node.js com express e mongodb que dá origem a uma API desenvolvida por Gustavo Caruso para teste técnico da [Lemon Energia](https://www.energialemon.com.br/) ©

<img src="https://assets.website-files.com/5f7e0994165e365ab297bfe7/5fb28b8004eb4b7dff6fcf23_logo-original.png" width="100px">

</div>

#

## Contexto

Nem todos os clientes que desejam fazer parte da Lemon podem ser aceitos no momento. Seja por razões regulatórias ou porque não vale a pena para o cliente ou para a Lemon ter essa empresa como cliente. 

No processo de aquisição de clientes, fazemos a checagem de elegibilidade da mesma, através dos dados contidos na conta de luz do cliente. Caso a empresa não seja elegível, precisamos explicitar os motivos para tal. Caso ela seja elegível, precisamos calcular também a projeção da quantidade de CO2 que ela deixaria de emitir caso usasse energia limpa.

## Critérios de Elegibilidade

- Classe de consumo da cliente
    - Possíveis Valores: Comercial, Residencial, Industrial, Poder Público, e Rural.
    - Elegíveis: Comercial, Residencial e Industrial.

- Modalidade tarifária
    - Possíveis Valores: Branca, Azul, Verde, e Convencional.
    - Elegíveis: Convencional, Branca.
- Consumo mínimo do cliente
    - O cálculo deve ser feito utilizando a média dos 12 valores mais recentes do histórico de consumo.
        - Clientes com tipo de conexão Monofásica só são elegíveis caso tenham consumo médio acima de 400 kWh.
        - Clientes com tipo de conexão Bifásica só são elegíveis caso tenham consumo médio acima de 500 kWh.
        - Clientes com tipo de conexão Trifásica só são elegíveis caso tenham consumo médio acima de 750 kWh.

- Para calcular a projeção da **economia anual** de CO2, considere que para serem gerados 1000 kWh no Brasil são emitidos em média 84kg de CO2.


## Informações para consumo da API:

<!-- Esse projeto esta hospedado na plataforma <a href="https://www.heroku.com/" target="_blank">HEROKU</a> e pode ser acessado através <a href="https://dg-cc-gustacaru.herokuapp.com/" target="_blank">DESTE LINK</a> -->

<!-- O Banco de dados utilizado é o <a target="_blank" href="https://www.mongodb.com/">MongoDB</a> e está hospedado no <a target="_blank" href="https://cloud.mongodb.com/">MongoCloud Atlas</a> -->

Esse projeto não tem front-end, por isso, para acessar a rota utilize um client como 
<a target="_blank" href="https://insomnia.rest/">Insomnia</a>, <a target="_blank" href="https://www.postman.com/">Postman</a> ou similar.

A rota disponível é: /admittance

###  1. http://localhost:3001/admittance - requisição HTTP: `POST` <br>
  **Esse endpoint deve receber como entrada um JSON no formato:**

  ```json
    {
      "numeroDoDocumento": "string",
      "tipoDeConexao": "string",
      "classeDeConsumo": "string",
      "modalidadeTarifaria": "string",
      "historicoDeConsumo": [ 1, 2, 3, .., 12 ]
    }
  ```

  **tendo respeitados os critérios abaixo como valores:**
  ```javascript
    const numeroDoDocumento = cpf || cnpj;
        const cpf = { type: 'string', pattern: '^\\d{11}$' };
        const cnpj = { type: 'string', pattern: '^\\d{14}$' };

    const tiposDeConexao = 'monofasico' || 'bifasico' || 'trifasico';

    const classesDeConsumo = 'residencial' || 'industrial' || 'comercial' || 'rural' || 'poderPublico';

    const modalidadesTarifarias = 'azul' || 'branca' || 'verde' || 'convencional';

    const historicoDeConsumo = { // em kWh
      type: 'array',
      minItems: 3,
      maxItems: 12,
      items: {
        type: 'integer',
        minimum: 0,
        maximum: 9999,
      };
  ```

  **Esse endpoint terá dois possíveis retornos.**

  1 - Cliente elegível. 
  ```json
    {
      "elegivel": true,
      "economiaAnualDeCO2": 00.0, //Valor em kW/h
    }
  ```

  2 - Cliente inelegível.
  ```json
    {
      "elegivel": false,
      "razoesInelegibilidade": [
        "Classe de consumo não aceita",
        "Modalidade tarifária não aceita",
        "Consumo muito baixo para tipo de conexão"
      ]
    }
  ```


## Informações de desenvolvimento:

Esse projeto utiliza as depêndencias diretas:
- `express` - framework para construção de servidores web e requisições HTTP,
- `mongodb` - banco de dados noSQL,

e também, as depêndencias de desenvolvimento:
- `nodemon` - lib p/ exercutar servidor ininterruptamente ,
- `mocha` - lib p/ teste,
- `chai` - lib p/ teste,
- `chai-http` - lib p/ teste,
- `sinon` - lib p/ teste,
- `mongodb-memory-server@6` - lib que simula banco de dados p/ teste;

### Para rodar esse projeto na sua máquina:
- Clone esse repositório para sua máquina e instale as dependencias com um gerenciador de pacotes de sua escolha - `npm`, `yarn`;

- Instale o banco de dados `mongodb` OU rode um container com sua imagem com docker.

- Para iniciar o servidor rode o comando `npm start` ou `npm run dev`. Ele rodará na porta :3001;

- O projeto esta coberto por teste de integração. Para ter acesso aos testes, verifique a pasta `./src/tests` ou rode o comando `npm test`;

#
