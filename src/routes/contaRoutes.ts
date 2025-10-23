import { Router, Request, Response } from "express"
import { pixDs } from "../data-source"
import {  JwtVerifyAuth } from "../functions/jwt"
import { Conta } from "../entities/conta.entity"

const contaRoutes = Router()
const contaRepo = pixDs.getRepository(Conta)

contaRoutes.patch("/", async (req: Request, resp: Response) => {
        const novoSaldo = req.body
        const authHeader = req.headers.authorization
        const teste = JwtVerifyAuth(authHeader ?? '')
        if (!teste || authHeader === undefined) return new Error("Token inválido, não permitido.")
        await contaRepo.update(novoSaldo.id, { ...novoSaldo })
        resp.statusCode = 200;
        resp.statusMessage = "Saldo atualizado"
        resp.json({ "status:": "OK" })


})


export default contaRoutes