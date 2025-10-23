import express, { Request, Response } from 'express';
import "reflect-metadata";
import { pixDs } from './data-source';
import usuarioRoutes from './routes/usuario.routes';
import cors from 'cors';
import chavesRoutes from './routes/chave.routes';
import transaRoutes from './routes/transacao.routes';
import contaRoutes from './routes/contaRoutes';
import autenticacaoRoutes from './routes/autenticacaoRoutes';
import app from './app';

// export const app = express()

async function main() {
    try {
        await pixDs.initialize()
        app.use(express.json())
        app.use(cors())
        app.use("/v1/usuarios", usuarioRoutes)
        app.use("/v1/conta", contaRoutes)
        app.use("/v1/autenticacao", autenticacaoRoutes)
         app.use("/v1/transacoes", transaRoutes ) 
        app.use("/v1/chaves", chavesRoutes)
        app.listen(4000, () => {
            console.log("Not Errors Found")
        })

    } catch (e) {
        console.log('Erro ao inicializar', e)
    }


}

main()






