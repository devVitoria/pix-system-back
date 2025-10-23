import express from 'express'
import cors from 'cors'
import usuarioRoutes from './routes/usuario.routes'
import autenticacaoRoutes from './routes/autenticacaoRoutes'
import contaRoutes from './routes/contaRoutes'
import transaRoutes from './routes/transacao.routes'
import chavesRoutes from './routes/chave.routes'

const app = express()

app.use(express.json())
app.use(cors())
app.use("/v1/usuarios", usuarioRoutes)
app.use("/v1/conta", contaRoutes)
app.use("/v1/autenticacao", autenticacaoRoutes)
app.use("/v1/transacoes", transaRoutes)
app.use("/v1/chaves", chavesRoutes)

export default app
