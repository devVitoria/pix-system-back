import { Router } from 'express'
import { Request, Response } from 'express';
import { Chave } from '../entities/chave.entity';
import { pixDs } from '../data-source';
import { Transacao } from '../entities/transacao.entity';
import { Conta } from '../entities/conta.entity';
import { JwtVerifyAuth } from '../functions/jwt';

const transaRoutes = Router()

const transaRepo = pixDs.getRepository(Transacao);

transaRoutes.post("/",
    async (req: Request, resp: Response) => {
        const { chave_origem, chave_destino, valor, mensagem } = req.body

        const valor_num = parseFloat(valor);
        const authHeader = req.headers.authorization
        const teste = JwtVerifyAuth(authHeader || "")
        if (!teste || authHeader === undefined) {
            resp.statusCode = 404;
            resp.statusMessage = "Acesso não permitido. Token inválido."
            resp.send()
            return
        }

        let transacao = new Transacao()

        const query = pixDs.createQueryRunner()
        await query.connect();
        await query.startTransaction();

        try {

            if (valor <= 0) {
                throw { status: 400, message: "Valor não pode ser menor que zero" }
                
            }
            if (isNaN(valor)) {
                throw { status: 400, message: "O valor deve ser um número" }
            }
            const contaOrigem = await query.manager.getRepository(Chave).query('select conta.id as id, conta.saldo as saldo from chaves inner join usuario on chaves."usuarioId" = usuario.id inner join conta on usuario."contaId" = conta.id where chaves.chave = $1', [String(chave_origem)])

            const contaDestino = await query.manager.getRepository(Chave).query('select conta.id as id, conta.saldo as saldo from chaves inner join usuario on chaves."usuarioId" = usuario.id inner join conta on usuario."contaId" = conta.id where chaves.chave = $1', [chave_destino])


            if (!contaOrigem || !contaDestino) {
                throw { status: 400, message: "A chave de destino ou de origem não foram encontradas" }

            }
            if (contaOrigem[0].id == contaDestino[0].id) {
                throw { status: 400, message: "A conta de origem não pode ser a mesma que a de destino" }

            }
            if (!contaOrigem[0] || Number(contaOrigem[0].saldo) < valor_num) {
                  resp.statusCode = 400;
                  resp.statusMessage = "Saldo insuficiente!"
                  resp.send()
                  return

            }
            const novoSaldoOrigem = Number(contaOrigem[0].saldo) - valor_num
            const novoSaldoDestino = Number(contaDestino[0].saldo) + valor_num

            await query.manager.update(Conta, contaOrigem[0].id, { saldo: novoSaldoOrigem })
            await query.manager.update(Conta, contaDestino[0].id, { saldo: novoSaldoDestino })


            transacao.chave_origem = { chave: chave_origem } as Chave
            transacao.chave_destino = { chave: chave_destino } as Chave
            transacao.data_transferencia = new Date().toISOString()
            transacao.mensagem = mensagem || ""
            transacao.valor = valor_num

            await query.manager.save(transacao)
            await query.commitTransaction()
           
         return resp.status(201).json({transacao: transacao, novoSaldo:  novoSaldoOrigem, token: authHeader?.split(" ")[1]})
        
        } catch (error: any) {
             await query.rollbackTransaction()
             return resp.status(error.status || 500).json({ message: error.message })
        } finally {
            query.release()
        }


    }
)

transaRoutes.get("/:id",
    async (req: Request, resp: Response) => {
        const authHeader = req.headers.authorization
        const teste = JwtVerifyAuth(authHeader || "")
        if (!teste) {
            resp.statusCode = 404;
            resp.statusMessage = "Acesso não permitido. Token inválido."
            resp.send()
            return
        }

        try {   
            const transacao = await transaRepo.findOneBy({ id: parseInt(req.params.id) });

            if (!transacao) {
                return resp.status(404).json({ message: "Transação não encontrada." });
            }
            return resp.status(200).json({  transacao: transacao, token: authHeader?.split(" ")[1] });
        } catch (error) {
            return resp.status(500).json({ message: "Erro ao buscar transação." });
        }
    });

transaRoutes.get("/pagination/:page",
    async (req: Request, resp: Response) => {
        const authHeader = req.headers.authorization
        const teste = JwtVerifyAuth(authHeader || "")
        if (!teste || authHeader === undefined) {
            resp.statusCode = 404;
            resp.statusMessage = "Acesso não permitido. Token inválido."
            resp.send()
            return
        }
  const page = parseInt(req.params.page as string) || 1;
  const skip = (page - 1) * 10;


    


      const [transacoes, total]  = await transaRepo.findAndCount({
  relations: ["chave_origem", "chave_destino"],
  skip: skip,
    take: 10,
});

    const totalPages = Math.ceil(Number(total) / 10);


        if (transacoes.length == 0) {
            resp.send("Nenhuma transação realizada")
            return
        }
        return resp.status(200).json({  transacoes: transacoes, totalPages,  token: authHeader?.split(" ")[1] });
    });
export default transaRoutes;