import { DataSource } from "typeorm";
import dotenv from 'dotenv'
import { Usuario } from "./entities/usuario.entity";
import { Chave } from "./entities/chave.entity";
import { Conta } from "./entities/conta.entity";
import { Autenticacao } from "./entities/autenticacao.entity";
import { Transacao } from "./entities/transacao.entity";
import { AutenticacaoBlackList } from "./entities/autenticacao-black-list.entity";
dotenv.config()


export const pixDs = new DataSource({
    
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? ''),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [Usuario, Chave, Conta, Autenticacao, AutenticacaoBlackList, Transacao],
    subscribers: [],
    migrations: [],
})

