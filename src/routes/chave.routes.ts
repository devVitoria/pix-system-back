import { Router } from 'express'
import { Request, Response } from 'express';
import { Chave } from '../entities/chave.entity';
import { pixDs } from '../data-source';
import { Usuario } from '../entities/usuario.entity';
import { JwtVerifyAuth } from '../functions/jwt';

const chavesRoutes = Router()

const chavesRepo = pixDs.getRepository(Chave);
const usuarioRepo = pixDs.getRepository(Usuario);

chavesRoutes.post("/",
    async (req: Request, resp: Response) => {
        const authHeader = req.headers.authorization
        const teste = JwtVerifyAuth(authHeader || "")
        if (!teste || authHeader === undefined) {
            resp.statusCode = 404;
            resp.statusMessage = "Acesso não permitido. Token inválido."
            resp.send()
        }

        const data = req.body

        let chave = new Chave()

        chave.chave = data.chave
        chave.tipo = data.tipo

        try {
            const veifica_chave = await chavesRepo.findOneBy({ chave: data.chave })
            if (veifica_chave) {
                throw Error("Essa chave já existe")
            }
            const usuarioId = data.usuarioId ?? data.usuario?.id;
            if (!usuarioId) {
                throw new Error("ID do usuário não informado");
                }

            const usuario = await usuarioRepo.findOneBy({ id: (usuarioId) })
            if (!usuario) {
                throw Error("Usuario não encontrado")
            }
            chave.usuario = usuario

            pixDs.manager.save(chave)
            resp.statusCode = 201
            resp.statusMessage = "Chave Criada"
            resp.send(chave)
        } catch (e: any) {
            console.log(e)
            resp.status(404).send(e.message ?? "Erro ao criar chave     ")
        }


    }
)
chavesRoutes.delete("/:chave",
    async (req: Request, resp: Response) => {
        const authHeader = req.headers.authorization
        const teste = JwtVerifyAuth(authHeader || "")
        if (!teste || authHeader === undefined) {
            resp.statusCode = 404;
            resp.statusMessage = "Acesso não permitido. Token inválido."
            resp.send()
        }

        const query = await chavesRepo.delete(
            req.params.chave
        )
        if ((query.affected || 0) > 0) {
            resp.statusCode = 204;
            resp.statusMessage = "Chave deletada!"
            resp.send()
        } else {
            resp.statusCode = 404;
            resp.statusMessage = "Chave não encontrada!"
            resp.send()
        }
    }
)


chavesRoutes.get("/:chave",
    async (req: Request, resp: Response) => {
        const authHeader = req.headers.authorization
        const teste = JwtVerifyAuth(authHeader || "")
        if (!teste || authHeader === undefined) {
            resp.statusCode = 404;
            resp.statusMessage = "Acesso não permitido. Token inválido."
            resp.send()
        }

        const chave = await chavesRepo.findOne({
            where: {
                chave: req.params.chave
            },
            relations: {
                transacaoOrigem: true,
                transacaoDestino: true
            }
        })
        resp.statusCode = 200;
        resp.statusMessage = "Requisição recebida"
        resp.json(
            chave
        )
    }
)

chavesRoutes.get("/",
    async (req: Request, resp: Response) => {
        const authHeader = req.headers.authorization
        const teste = JwtVerifyAuth(authHeader || "")
        if (!teste || authHeader === undefined) {
            resp.statusCode = 404;
            resp.statusMessage = "Acesso não permitido. Token inválido."
            resp.send()
        }

        const chaves = await chavesRepo.query("SELECT * FROM chaves")
        resp.statusCode = 200;
        resp.statusMessage = "Requisição recebida"
        resp.json(
            chaves
        )
    }
)
export default chavesRoutes;