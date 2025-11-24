import { Router, Request, Response } from "express";
import { pixDs } from "../data-source";
import { JwtVerifyAuth } from "../functions/jwt";
import { Conta } from "../entities/conta.entity";

const contaRoutes = Router();
const contaRepo = pixDs.getRepository(Conta);
const userRepo = pixDs.getRepository(Conta);

contaRoutes.patch("/", async (req: Request, resp: Response) => {
  const novoSaldo = req.body;
  const authHeader = req.headers.authorization;
  const teste = JwtVerifyAuth(authHeader ?? "");
  if (!teste || authHeader === undefined)
    return new Error("Token inválido, não permitido.");
  const constID = await userRepo.findOne({ where: { id: novoSaldo.id } });
  if (!constID) {
    resp.statusCode = 404;
    resp.statusMessage = "Conta não encontrada";
    resp.send();
    return;
  }
  try {
    await contaRepo.update(
      { nroConta: constID.nroConta },
      { saldo: novoSaldo.saldo }
    );

    resp.statusCode = 200;
    resp.statusMessage = "Saldo atualizado";
    resp.json({ "status:": "OK" });
    return
  } catch (error) {
    console.log("Erro ao atualizar saldo", error);
  }
});

export default contaRoutes;
