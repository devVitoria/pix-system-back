-- =========================
-- PostgreSQL 17 Database Schema
-- =========================
-- =========================
-- Tabela: USUÁRIO
-- =========================
CREATE TABLE usuarios (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cpf_cnpj VARCHAR(14) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(15),
    rua VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    numero_conta INTEGER NOT NULL,
);

-- =========================
-- Tabela: CHAVE
-- =========================
CREATE TABLE chaves (
    chave VARCHAR NOT NULL PRIMARY KEY,
    tipo CHAR(1) NOT NULL,
    usuario_id INTEGER NOT NULL,
    CONSTRAINT fk_chaves_usuario_id FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT chk_chaves_tipo CHECK (tipo IN ('E', 'T', 'C', 'A')),
    -- Email, Telefone, CPF/CNPJ, Aleatória
    CONSTRAINT chk_chaves_chave_not_empty CHECK (LENGTH(TRIM(chave)) > 0)
);

-- =========================
-- Tabela: TRANSAÇÃO
-- =========================
CREATE TABLE transacoes (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    data_transferencia date not null default CURRENT_date,
    valor money NOT NULL,
    mensagem TEXT,
    chave_origem VARCHAR NOT NULL,
    chave_destino VARCHAR NOT NULL,
    CONSTRAINT fk_transacoes_chave_origem FOREIGN KEY (chave_origem) REFERENCES chaves(chave),
    CONSTRAINT fk_transacoes_chave_destino FOREIGN KEY (chave_destino) REFERENCES chaves(chave),
    CONSTRAINT chk_transacoes_valor_positive CHECK (valor > 0),
    CONSTRAINT chk_transacoes_chaves_different CHECK (chave_origem <> chave_destino)
);
