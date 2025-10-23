import request from "supertest";
import app from "../app";
import { pixDs } from "../data-source";
import { Usuario } from "../entities/usuario.entity";

describe("Api de usuário", () => {

  let userId: number;
  let token: string;
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

  it("POST /v1/usuarios deve criar um usuário", async () => {
    const res = await request(app)
      .post("/v1/usuarios")
      .send({
        nome: "Vitória",
        cpfcnpj: "9809089089",
        telefone: "567675",
        rua: "Rua Teste",
        bairro: "Centro",
        cidade: "Passo Fundo",
        email: "vitoria@test.com",
        password: "123",
        conta: { nroConta: 441886, saldo: 0 },
      });


    expect(res.statusCode).toBe(201);

    const userRepo = pixDs.getRepository(Usuario);
    const usuario = await userRepo.findOne({
      where: { email: "vitoria@test.com" },
    });

    expect(usuario).toBeDefined();
    userId = usuario?.id ?? 0;
  });

  it("um get na /v1/autenticacao/login, precisa retornar o token pro usuario criado ali em cima", async () => {
    const res = await request(app).post("/v1/autenticacao/login").send({
      email: "vitoria@test.com",
      password: "123",
    });

    token = res.body["status:"]
    expect(res.body).toHaveProperty("status:");
    expect(typeof res.body["status:"]).toBe("string");
  });


  it("um get na /v1/usuarios, precisa retornar status 200", async () => {
    const res = await request(app).get("/v1/usuarios").set("Authorization", token);
    expect(res.statusCode).toBe(200);
  });

  it("GET /v1/usuarios/id deve puxar o usuário criado", async () => {
    const res = await request(app)
      .get(`/v1/usuarios/${userId}`)
      .set("Authorization", token);
    expect(res.statusCode).toBe(200);
  });

  it("GET /v1/usuarios/:id deve retornar o usuário criado", async () => {
    const res = await request(app)
      .get(`/v1/usuarios/${userId}`)
      .set("Authorization", token);
    expect(res.statusCode).toBe(200);
  });

  it("PATCH /v1/usuarios/:id deve atualizar o nome do usuário", async () => {
    const res = await request(app)
      .patch(`/v1/usuarios/${userId}`)
      .set("Authorization", token)
      .send({ nome: "VitóriaMODIFITESTE" });

    expect(res.statusCode).toBe(200);
  });
});
