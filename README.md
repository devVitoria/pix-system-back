## Pix-System 

This project provides multiple RESTful services that simulate the Pix payment system.  
It was developed as part of a college assignment and includes modules for authentication, users, accounts, Pix keys, and transactions.


## Technologies

- Node.js + Express 
- TypeScript
- TypeORM 
- JWT Authentication
- PostgreSQL 



## Getting Started

Run the command below to download the dependencies.

```bash
npm install
# or
yarn
```


Run the server: 

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```



Run the tests: 

```bash
npm run test
# or
yarn test
```

## Endpoints

### Authentication 

| Method | Route                              | Description  |
|--------|-------------------------------------|--------------|
| POST   | `http://localhost:4000/v1/autenticacao/login` | User login   |

Request Body:

```json
{
  "email": "string",
  "password": "string"

} 

```

| Method | Route                              | Description  |
|--------|-------------------------------------|--------------|
| DELETE   | `http://localhost:4000/v1/autenticacao/logout/:idUsuario` | User logout   |

---

### User

| Method | Route                              | Description  |
|--------|-------------------------------------|--------------|
| POST   | `http://localhost:4000/v1/usuarios` | Create user   |

Request Body:

```json

{
  "cpfcnpj": "string",
  "nome": "string",
  "bairro": "string",
  "rua": "string",
  "telefone": "string",
  "cidade": "string",
  "conta": 
  {
    "nroConta": 0,
    "saldo": 0
  },
  "email": "string",
  "password": "string"
}

```

| Method | Route                              | Description  |
|--------|-------------------------------------|--------------|
| PATCH   | `http://localhost:4000/v1/usuarios/:id` | Update user data  |


Request Body:
```json
{
  "nome": "string"
}
```

| Method | Route                              | Description  |
|--------|-------------------------------------|--------------|
| DELETE   | `http://localhost:4000/v1/usuarios/:id` | Delete user|
| GET   | `http://localhost:4000/v1/usuarios` | Get users |
| GET   | `http://localhost:4000/v1/usuarios/:id` | Get user by ID |
| GET   | `http://localhost:4000/v1/usuarios/:id/chaves` | Get user Pix keys |
| GET   | `http://localhost:4000/v1/usuarios/:id/transacoes` | Get user transactions|


---

### Keys

| Method | Route                              | Description  |
|--------|-------------------------------------|--------------|
| POST   | `http://localhost:4000/v1/chaves` | Create Pix key |


Request Body:
```json

{
  "chave": "string",
  "tipo": "string",
  "usuario": 
  {
    "id": 0
  }
}
```

---

### Account

| Method | Route                              | Description  |
|--------|-------------------------------------|--------------|
| PATCH   | `http://localhost:4000/v1/conta` | Update account balance |

Request Body:

```json
{
  "id": 0,
  "nroConta": 0,
  "saldo": 0
}
```

---

### Transactions


| Method | Route                              | Description  |
|--------|-------------------------------------|--------------|
| POST   | `http://localhost:4000/v1/transacoes` | Create transaction |

Request Body:

```json

{
  "chave_origem": "string",
  "chave_destino": "string",
  "valor": 0,
  "mensagem": "string"
}
```
