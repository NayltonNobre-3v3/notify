# notify
Notify - BACKEND + FRONTEND
## :card_index:Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- [Node.js](https://nodejs.org/en/)
- [React](https://reactjs.org)
- [Toastify](https://fkhadra.github.io/react-toastify/introduction/)
- [Knex](http://knexjs.org/)

### Utilizando o Server

```sh

# Executando a aplicação:
$ npm start

# Instanciando o banco de dados:
$ npm run knex:migrate

# Criando migration:
$  npx knex migrate:make name_migration
```
### Organização das pastas

  - **WriteRead**
    Pasta que engloba as operações envolvendo o monitoramento do server
  - **WriteRead/function/WriteRead**
    Onde irá realizar as operações: **Ler diretório**,**Ler banco de notificações**,**Verificar condições**,**Calcular variações**,**Enviar email**.
  - **variables_api**
    Variáveis globais em que seus valores podem ser acessados em qualquer lugar do servidor.
  - **Resources**
    Onde está o arquivo HTML+CSS resposáveis por dar o visual do email que irá ser enviado.
  - **Modules**
    Configuração do nodemailer.
  - **Config**
    Arquivo com informações sobre a conta do email, porta e qual serviço de email é usado.
  - **Database**
    Pasta que armazena o arquivo de configuração do banco (connection.js) e as migrations.


