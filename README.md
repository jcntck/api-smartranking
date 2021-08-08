# API SmartRanking

API desenvolvida em NestJS no curso de Node.js Microservices da Udemy ([Link do curso aqui](https://www.udemy.com/course/construindo-um-backend-escalavel-com-nestjs-aws-e-pivotalws/)).

## Problemática

Necessidade de desenvolver um sistema que automatize o processo de gerenciamento de partidas e classificação de rankings.

## Tecnologias
- TypeScript
- JavaScript
- NestJs
*Armazenamento feito em memoria apenas temporariamente*


## Entidades

### - Jogador
```TypeScript
interface Jogador {
	readonly _id:  string;
	readonly telefoneCelular:  string;
	readonly email:  string;
	nome:  string;
	ranking:  string;
	posicaoRanking:  number;
	urlFotoJogador:  string;
}
```

## Endpoints

### POST /api/v1/jogadores
Cadastra ou atualiza um registro existente pelo e-mail
```JSON
{
	"telefoneCelular": "+55999999999",
	"email": "email.jogador@dominio.com",
	"nome": "Nome do Jogador"
}
```
##
### GET /api/v1/jogadores
Consulta todos os jogadores ou apenas um jogador se passado o e-mail como parâmetro via *query string*.
##
### DELETE /api/v1/jogadores
Deleta um jogador pelo e-mail passado como parâmetro via *query string*