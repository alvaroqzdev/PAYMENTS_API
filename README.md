# Payments_API

<p align="center">
  <strong>Payments_API</strong><br>
  API REST para cadastro de usuarios, autenticacao JWT, carteiras digitais e transferencias entre contas.
</p>

<p align="center">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white">
  <img alt="Express" src="https://img.shields.io/badge/Express-5.2.1-000000?logo=express&logoColor=white">
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-6.19.3-2D3748?logo=prisma&logoColor=white">
  <img alt="MySQL" src="https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white">
  <img alt="Tests" src="https://img.shields.io/badge/tests-Jest%20%2B%20Supertest-C21325?logo=jest&logoColor=white">
</p>

## Descricao

Payments_API e uma API de pagamentos que permite criar usuarios, autenticar com JWT, consultar saldo de carteira e realizar transferencias entre usuarios cadastrados.

O projeto resolve o fluxo basico de uma carteira digital: cada usuario criado recebe uma wallet com saldo inicial `0.00`, pode fazer login para receber tokens de acesso e pode enviar pagamentos para outro usuario, com registro do status da transacao (`ENVIADO`, `CANCELADO` ou `PENDENTE`).

## Tecnologias

| Tecnologia | Versao principal | Uso |
| --- | --- | --- |
| Node.js | 20.x | Runtime da API. |
| Express | 5.2.1 | Servidor HTTP e rotas REST. |
| Prisma | 6.19.3 | ORM e migrations. |
| MySQL | 8 | Banco de dados relacional. |
| Zod | 4.4.3 | Validacao de entrada. |
| JSON Web Token | 9.0.3 | Autenticacao com access token e refresh token. |
| bcryptjs | 3.0.3 | Hash e comparacao de senhas. |
| Winston | 3.19.0 | Logs da aplicacao. |
| Jest | 30.4.2 | Testes unitarios e de integracao. |
| Supertest | 7.2.2 | Testes HTTP da API Express. |
| Docker Compose | - | Subida local da API e MySQL. |

## Pre-requisitos

- Node.js 20.x ou superior.
- npm.
- Docker e Docker Compose, caso queira rodar com container.
- MySQL 8, caso queira rodar sem Docker.
- Arquivo `.env` criado a partir de `.env.example`.
- Variaveis obrigatorias: `DATABASE_URL`, `DB_ROOT_PASSWORD`, `DB_NAME`, `API_PORT`, `JWT_SECRET`, `JWT_EXPIRES`, `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRES` e `WEBHOOK_URL`.

## Como rodar localmente

1. Clone o repositorio e acesse a pasta:

```bash
git clone <url-do-repositorio>
cd Payments_API
```

2. Instale as dependencias:

```bash
npm install
```

3. Crie o arquivo `.env`:

```bash
cp .env.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

4. Preencha o `.env`. Exemplo para uso local com Docker:

```env
DATABASE_URL=mysql://root:root@localhost:3306/payments_api
DB_ROOT_PASSWORD=root
DB_NAME=payments_api
API_PORT=3001
JWT_SECRET=secret_access_token
JWT_EXPIRES=1h
JWT_REFRESH_SECRET=secret_refresh_token
JWT_REFRESH_EXPIRES=7d
WEBHOOK_URL=http://localhost:3002/webhook
```

5. Suba o banco de dados com Docker Compose:

```bash
docker compose up -d db
```

6. Gere o Prisma Client e aplique as migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

No Windows PowerShell, se `npx` for bloqueado pela Execution Policy, use:

```powershell
npx.cmd prisma generate
npx.cmd prisma migrate dev
```

7. Rode a API em desenvolvimento:

```bash
npm run dev
```

8. A API ficara disponivel em:

```text
http://localhost:<API_PORT>/api/v1
```

Para rodar API e banco juntos com Docker Compose:

```bash
docker compose up --build
```

## Variaveis de ambiente

| Variavel | Obrigatoria | Exemplo | Descricao |
| --- | --- | --- | --- |
| `DATABASE_URL` | Sim | `mysql://root:root@localhost:3306/payments_api` | URL de conexao usada pelo Prisma. |
| `DB_ROOT_PASSWORD` | Sim | `root` | Senha do usuario root do MySQL no Docker Compose. |
| `DB_NAME` | Sim | `payments_api` | Nome do banco criado pelo container MySQL. |
| `API_PORT` | Sim | `3001` | Porta em que a API sera exposta. |
| `JWT_SECRET` | Sim | `secret_access_token` | Chave usada para assinar o access token. |
| `JWT_EXPIRES` | Sim | `1h` | Tempo de expiracao do access token. |
| `JWT_REFRESH_SECRET` | Sim | `secret_refresh_token` | Chave usada para assinar o refresh token. |
| `JWT_REFRESH_EXPIRES` | Sim | `7d` | Tempo de expiracao do refresh token. |
| `WEBHOOK_URL` | Sim | `http://localhost:3002/webhook` | URL chamada apos tentativas de transacao. |

## Endpoints da API

Base URL:

```text
http://localhost:<API_PORT>/api/v1
```

| Metodo | Rota | Autenticacao | Exemplo de entrada | Descricao |
| --- | --- | --- | --- | --- |
| `POST` | `/user` | Nao | `{ "name": "Alvaro Silva", "email": "alvaro@email.com", "password": "12345678", "phone": "12999999999", "cpf": "12345678911" }` | Cria usuario e wallet com saldo inicial `0.00`. |
| `GET` | `/user/:email` | Nao | `/user/alvaro@email.com` | Busca usuario pelo e-mail. |
| `POST` | `/login` | Nao | `{ "email": "alvaro@email.com", "password": "12345678" }` | Retorna `acessToken` e `refreshToken`. |
| `GET` | `/balance/:id` | Bearer token | `/balance/<user_id>` | Retorna o saldo da wallet do usuario informado. |
| `POST` | `/transaction` | Bearer token | `{ "recipient": "<recipient_user_id>", "amount": 100 }` | Transfere saldo do usuario autenticado para o destinatario. |
| `POST` | `/transaction/status` | Bearer token | `{ "id": "<transaction_id>", "status": "CANCELADO" }` | Atualiza o status de uma transacao. |
| `GET` | `/transactions/page` | Bearer token | `/transactions/page?page=1&limit=10` | Lista transacoes enviadas ou recebidas pelo usuario autenticado. |

Header para rotas autenticadas:

```http
Authorization: Bearer <acessToken>
```

Exemplo de login:

```bash
curl -X POST http://localhost:3001/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alvaro@email.com","password":"12345678"}'
```

Exemplo de transacao:

```bash
curl -X POST http://localhost:3001/api/v1/transaction \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <acessToken>" \
  -d '{"recipient":"<recipient_user_id>","amount":100}'
```

## Estrutura de diretorios

```text
Payments_API/
|-- docker-compose.yml          # Orquestra API e banco MySQL.
|-- dockerfile                  # Imagem Node.js 20 Alpine da API.
|-- package.json                # Scripts, dependencias e metadados.
|-- package-lock.json           # Lockfile do npm.
|-- prisma/
|   |-- schema.prisma           # Modelos User, Wallet, Transaction e enum Status.
|   `-- migrations/             # Historico de migrations do banco.
|-- src/
|   |-- app.js                  # Configuracao do Express, middlewares e rotas.
|   |-- server.js               # Inicializacao do servidor HTTP.
|   |-- config/
|   |   |-- database.js         # Prisma Client.
|   |   `-- env.js              # Validacao das variaveis de ambiente com Zod.
|   |-- middlewares/
|   |   |-- auth.middleware.js  # Validacao do Bearer token.
|   |   |-- error.middleware.js # Tratamento global de erros.
|   |   |-- rateLimit.middleware.js
|   |   `-- validate.middleware.js
|   |-- modules/
|   |   |-- auth/               # Login, schema e regras de autenticacao.
|   |   |-- transactions/       # Criacao, listagem e status de transacoes.
|   |   |-- users/              # Cadastro e busca de usuarios.
|   |   |-- wallets/            # Consulta de saldo.
|   |   `-- webhooks/           # Envio de webhook apos transacoes.
|   `-- utils/
|       |-- AppError.js
|       |-- hash.js             # Hash e comparacao de senhas.
|       |-- logger.js           # Logger Winston.
|       `-- token.js            # Geracao e validacao de tokens JWT.
`-- tests/
    |-- integration/            # Testes HTTP com Supertest.
    `-- unit/                   # Testes unitarios de services.
```

## Como rodar os testes

O projeto usa Jest e Supertest. Como o script `npm test` ainda esta com o placeholder padrao do npm, rode diretamente:

```bash
npx jest --runInBand
```

No Windows PowerShell, se `npx` for bloqueado:

```powershell
npx.cmd jest --runInBand
```

O que e testado:

| Arquivo | Tipo | Cobertura |
| --- | --- | --- |
| `tests/unit/auth.service.test.js` | Unitario | Login valido, senha invalida e e-mail inexistente. |
| `tests/unit/transactions.service.test.js` | Unitario | Transacao valida, saldo insuficiente e usuarios iguais. |
| `tests/integration/auth.routes.test.js` | Integracao | Rota `POST /api/v1/login`. |
| `tests/integration/transactions.routes.test.js` | Integracao | Rota `POST /api/v1/transaction` com middleware de autenticacao mockado. |

Status observado nesta maquina:

```text
Test Suites: 4 passed, 4 total
Tests:       12 passed, 12 total
```

As falhas atuais estao nos testes de integracao que esperam `400` ou `403`, mas o middleware global de erro retorna `500` para esses cenarios.
