module.exports = (_req, res, _next) => {
  return res.status(200).send(`
    <body style="text-align: center; margin: 10rem; background-color: rgb(1,85,1);">

      <img width="100px" src="https://assets.website-files.com/5f7e0994165e365ab297bfe7/5fb28b8004eb4b7dff6fcf23_logo-original.png" />

      <br><br><br>

      <span style="font-size: x-large; text-align: center">
        Bem vindo ao teste técnico de back-end de
        Gustavo Caruso para a <a style="text-decoration: none; color: white" href="https://www.energialemon.com.br/">Lemon Energia</a>
      </span>

      <br><br><br><br>

        <a href="https://github.com/gusttavocaruso/lemon-energy">
          <img width="150px" src="https://notion-emojis.s3-us-west-2.amazonaws.com/prod/svg-twitter/1f34b.svg"/>
        </a>

      <br><br>

      <span style="font-size: large; font-weight: 500; background-color: green; border-radius: 10px; text-decoration: none; color: white;  width: 30%">
        Acesse o limão e tenha acesso a documentação.
      </span>

    </body>
  `);
}
