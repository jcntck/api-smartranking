
# API SmartRanking
API desenvolvida em NestJS no curso de Node.js Microservices da Udemy ([Link do curso aqui](https://www.udemy.com/course/construindo-um-backend-escalavel-com-nestjs-aws-e-pivotalws/)).

## Problemática
Necessidade de desenvolver um sistema que automatize o processo de gerenciamento de partidas e classificação de rankings.

## Tecnologias
- TypeScript
- JavaScript
- NestJs
- Mongoose

**Armazenamento:**
- MongoDB

## Jogador

#### POST
#### /api/v1/jogadores
Cadastra um novo jogador

**Exemplo:**
```JSON
{
	"telefoneCelular": "+5500000000000",
	"email": "email_do_jogador@dominio.com",
	"nome": "Nome do jogador"
}
```

#### PUT
#### /api/v1/jogadores/:_id
Atualiza um jogador existente referenciado pelo `_id`

**Exemplo:**
```JSON
{
	"telefoneCelular": "+5500000000000",
	"nome": "Nome do jogador"
}
```
#### DELETE
#### /api/v1/jogadores/:_id
Remove um jogador existente referenciado pelo `_id`

#### GET 
#### /api/v1/jogadores
Retorna um array com todos os jogadores cadastrados

#### GET 
#### /api/v1/jogadores/:_id
Retorna um jogador com o `_id` passado por parâmetro  
