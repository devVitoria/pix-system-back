# top-ii-backend-api-template
Repositório da aplicação de backend simulando a API do PIX

Rodando a aplicação

Antes, rode yarn ou npm i para instalar as dependeências do projeto.
Após, utilize o .env.exemple e crie o arquivo .env para que a aplicação consiga puxar as variáveis de ambiente.

Para iniciar o projeto, rode yarn run dev ou npm run dev.
Para rodar os testes, rode yarn test ou npm run test

## Diagrama Entidade-Relacionamento

. env

DB_HOST=127.0.0.1
DB_PORT=5432
DB_USERNAME=postgres
DB_NAME=pix_system
DB_PASSWORD=masterkey
JWT_SECRET='gerarDev'

```mermaid
erDiagram
    usuarios {
        INTEGER id PK "GENERATED ALWAYS AS IDENTITY"
        VARCHAR cpf_cnpj UK "NOT NULL, UNIQUE"
        VARCHAR nome "NOT NULL"
        VARCHAR telefone
        VARCHAR rua
        VARCHAR bairro
        VARCHAR cidade
        INTEGER numero_conta "NOT NULL"
    }
    contas{
      INTEGER numero_conta PK "GENERATED ALWAYS AS IDENTITY"
      DECIMAL saldo "DEFAULT 0"
      INTEGER usuario_id FK "NOT NULL"
    }

    chaves {
        VARCHAR chave PK "NOT NULL"
        CHAR tipo "NOT NULL, CHECK (E,T,C,A)"
        INTEGER usuario_id FK "NOT NULL"
    }

    transacoes {
        INTEGER id PK "GENERATED ALWAYS AS IDENTITY"
        DATE data_transferencia "NOT NULL, DEFAULT CURRENT_DATE"
        MONEY valor "NOT NULL, CHECK > 0"
        TEXT mensagem
        VARCHAR chave_origem FK "NOT NULL"
        VARCHAR chave_destino FK "NOT NULL"
    }
    usuarios ||--o{contas : "tem"
    usuarios ||--o{ chaves : "possui"
    chaves ||--o{ transacoes : "origem"
    chaves ||--o{ transacoes : "destino"
```

### Descrição das Entidades

#### USUARIOS
- **Descrição**: Armazena informações dos usuários do sistema
- **Chave Primária**: id (auto-incremento)
- **Chave Única**: cpf_cnpj
- **Campos Obrigatórios**: id, cpf_cnpj, nome, numero_conta

#### CONTAS
- **Descrição**: Contém o saldo da conta de cada Usuário
- **Chave Primária**: numero_conta (auto-incremento)
- **Valor Default**: o saldo sempre começa com o valor 0

#### CHAVES
- **Descrição**: Chaves PIX associadas aos usuários
- **Chave Primária**: chave (texto)
- **Tipos**: E (Email), T (Telefone), C (CPF/CNPJ), A (Aleatória)
- **Relacionamento**: Cada chave pertence a um usuário

#### TRANSACOES
- **Descrição**: Registra todas as transferências PIX realizadas
- **Chave Primária**: id (auto-incremento)
- **Relacionamentos**: Referencia duas chaves (origem e destino)
- **Restrições**: Valor deve ser positivo, chaves origem e destino devem ser diferentes

### Relacionamentos

1. **USUARIOS → CHAVES**: Um usuário pode ter múltiplas chaves PIX (1:N)
2. **USUARIOS → CONTAS**: Um usuário pode ter uma conta e uma conta é somente de um usuário (1:1)
3. **CHAVES → TRANSACOES (origem)**: Uma chave pode ser origem de múltiplas transações (1:N)
4. **CHAVES → TRANSACOES (destino)**: Uma chave pode ser destino de múltiplas




## API REST - Endpoints

### Usuários

#### Listar usuários
```
GET /api/v1/usuarios
GET /api/v1/usuarios?page=1&limit=10
```

#### Buscar usuário por ID
```
GET /api/v1/usuarios/{id}
```

#### Buscar usuário por CPF/CNPJ
```
GET /api/v1/usuarios/cpf/{cpf_cnpj}
```

#### Criar usuário
```
POST /api/v1/usuarios
Content-Type: application/json

{
  "cpf_cnpj": "12345678901",
  "nome": "João Silva",
  "telefone": "11999999999",
  "rua": "Rua das Flores, 123",
  "bairro": "Centro",
  "cidade": "São Paulo",
  "numero_conta": 12345
}
```

#### Atualizar usuário
```
PUT /api/v1/usuarios/{id}
PATCH /api/v1/usuarios/{id}
```

#### Deletar usuário
```
DELETE /api/v1/usuarios/{id}
```

### Chaves PIX

#### Listar chaves de um usuário
```
GET /api/v1/usuarios/{usuario_id}/chaves
```

#### Buscar chave específica
```
GET /api/v1/chaves/{chave}
```

#### Criar chave PIX
```
POST /api/v1/usuarios/{usuario_id}/chaves
Content-Type: application/json

{
  "chave": "joao@email.com",
  "tipo": "E"
}
```

#### Deletar chave PIX
```
DELETE /api/v1/chaves/{chave}
```

#### Listar todas as chaves (admin)
```
GET /api/v1/chaves
```

### Transações

#### Listar transações
```
GET /api/v1/transacoes
GET /api/v1/transacoes?page=1&limit=20
GET /api/v1/transacoes?data_inicio=2024-01-01&data_fim=2024-12-31
```

#### Buscar transação por ID
```
GET /api/v1/transacoes/{id}
```

#### Histórico de transações por chave
```
GET /api/v1/chaves/{chave}/transacoes
GET /api/v1/chaves/{chave}/transacoes/enviadas
GET /api/v1/chaves/{chave}/transacoes/recebidas
```

#### Histórico de transações por usuário
```
GET /api/v1/usuarios/{usuario_id}/transacoes
```

#### Realizar transferência PIX
```
POST /api/v1/transacoes
Content-Type: application/json

{
  "chave_origem": "11999999999",
  "chave_destino": "maria@email.com",
  "valor": 100.50,
  "mensagem": "Pagamento aluguel"
}
```

#### Consultar saldo por chave
```
GET /api/v1/chaves/{chave}/saldo
```



### Códigos de Status HTTP

- `200 OK` - Sucesso
- `201 Created` - Recurso criado
- `204 No Content` - Sucesso sem retorno
- `400 Bad Request` - Dados inválidos
- `401 Unauthorized` - Não autorizado
- `403 Forbidden` - Acesso negado
- `404 Not Found` - Recurso não encontrado
- `409 Conflict` - Conflito (chave já existe)
- `422 Unprocessable Entity` - Validação falhou
- `500 Internal Server Error` - Erro interno

#### Filtros e Paginação

**Parâmetros comuns**:
- `page` - Número da página (padrão: 1)
- `limit` - Itens por página (padrão: 10, máximo: 100)
- `sort` - Campo para ordenação
- `order` - Direção da ordenação (asc/desc)

 **Exemplo**:
```
GET /api/v1/transacoes?page=2&limit=20&sort=valor&order=desc&data_inicio=2024-01-01
```
