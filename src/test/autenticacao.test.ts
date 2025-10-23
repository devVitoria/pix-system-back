import request from "supertest";
import app from "../app";
import { pixDs } from "../data-source";

describe("Api de usuário", () => {
    let token: string
    let userId: number

  beforeAll(async () => {
    if (!pixDs.isInitialized) {
      await pixDs.initialize();
    }
    const queryRunner = pixDs.createQueryRunner();
    await queryRunner.query("DELETE FROM transacoes");
    await queryRunner.query("DELETE FROM chaves");
    await queryRunner.query("DELETE FROM autenticacao");
    await queryRunner.query("DELETE FROM usuario");
    await queryRunner.query("DELETE FROM conta");
    await queryRunner.release();
  });

  afterAll(async () => {
    if (pixDs.isInitialized) {
      await pixDs.destroy();
    }
  });
    it("POST /v1/usuarios deve criar um usuário pra ser usado no login depois", async () => {
        const res = await request(app)
            .post("/v1/usuarios")
            .send({
                nome: "VitóriaLOGIN",
                cpfcnpj: "5645645",
                telefone: "343424324",
                rua: "Rua Teste",
                bairro: "Centro",
                cidade: "Passo Fundo",
                email: "vitoria@login.com",
                password: "258456",
                conta: { nroConta: 5645645, saldo: 0 },
            });

        userId = res.body["status:"];
        expect(res.statusCode).toBe(201);

    });


    it("POST /v1/autenticacao/login deve gerar o token", async () => {
        const res = await request(app)
            .post("/v1/autenticacao/login")
            .send({
                email: "vitoria@login.com",
                password: "258456",
            });

        token = res.body["status:"];
        expect(res.body).toHaveProperty("status:");
        expect(typeof res.body["status:"]).toBe("string");



    });

    it("GET /v1/usuarios deve permitir o acesso a API com o token válido", async () => {
        const res = await request(app)
            .get(`/v1/usuarios`)
            .set("Authorization", token);

        expect(res.statusCode).toBe(200);
    });

    it("DESLOGAR /v1/autenticacao/logout  deve excluir o token do usuario", async () => {
        const res = await request(app)
            .patch(`/v1/autenticacao/logout/${userId}`)
        expect(res.statusCode).toBe(200);
    });

});
