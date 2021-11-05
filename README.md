# notify
Notify - BACKEND + FRONTEND
## :card_index:Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- [Node.js](https://nodejs.org/en/)
- [Knex](http://knexjs.org/)

### Utilizando o Server
#É necessário criar um arquivo .env com base no modelo de arquivo .env-example contendo as configurações necessário para o funcionamento do servidor
```sh
  HOST=Host do banco de dados
  USER= Usuário do banco de dados
  PASSWORD= Senha do banco de dados
  DATABASE= Banco de dados utilizado
  ROOT=example/past/file -> onde irá ficar o pasta com os aquivos do /mnt/fcir
  MAIL_PROVIDER=
```

```sh
#Criar um arquivo de migration
$ npx knex migrate:make migration_create_table

#Instalar o Babel
$ npm install babel-cli @babel/node @babel/cli @babel/core

# Executando a aplicação:
$ npm start

# Instanciando o banco de dados:
$ npm run knex:migrate ou npx knex migrate:latest

# Criando migration:
$  npx knex migrate:make name_migration
```
### Organização das pastas

  - **Modules**
    Pasta com os casos de usos e controladores do sistema
  - **Shared**
    Onde irá ficar a infraestrutura principal do sistema (Aplicação do knex, rotas http, e outras implementações de libs de terceiros...).
  - **Config**
    Configurações de algumas libs


