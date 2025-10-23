import supertest from "supertest";
import { pixDs } from "../data-source";
import { Usuario } from "../entities/usuario.entity";
import { Conta } from "../entities/conta.entity";
import { Chave } from "../entities/chave.entity";
import { JwtCreate } from "../functions/jwt"; 
import app from "../app";

describe("Testes /transacoes", () => {
  let usuarioOrigem: Usuario;
  let contaOrigem: Conta;
  let chaveOrigem: Chave;

  let usuarioDestino: Usuario;
  let contaDestino: Conta;
  let chaveDestino: Chave;

  beforeAll(async () => {
   await pixDs.initialize();
  const queryRunner = pixDs.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.release();
  });

  afterAll(async () => {
    await pixDs.destroy();
  });

  beforeEach(async () => {
    const usuarioRepo = pixDs.getRepository(Usuario);
    const contaRepo = pixDs.getRepository(Conta);
    const chaveRepo = pixDs.getRepository(Chave);

    contaOrigem = await contaRepo.save({ nroConta: 1111, saldo: 1000 });
    usuarioOrigem = await usuarioRepo.save({
      cpfcnpj: "111",
      nome: "Usuario Origem",
      email: "origem@teste.com",
      password: "123",
      telefone: "1111", rua: "a", bairro: "b", cidade: "c",
      conta: contaOrigem,
    });
    chaveOrigem = await chaveRepo.save({
      chave: "chave-origem",
      tipo: "email",
      usuario: usuarioOrigem,
    });

    contaDestino = await contaRepo.save({ nroConta: 2222, saldo: 500 });
    usuarioDestino = await usuarioRepo.save({
      cpfcnpj: "222",
      nome: "Usuario Destino",
      email: "destino@teste.com",
      password: "123",
      telefone: "2222", rua: "a", bairro: "b", cidade: "c",
      conta: contaDestino,
    });
    chaveDestino = await chaveRepo.save({
      chave: "chave-destino",
      tipo: "email",
      usuario: usuarioDestino,
    });
  });

  afterEach(async () => {
   const queryRunner = pixDs.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.query("DELETE FROM transacoes");
  await queryRunner.query("DELETE FROM chaves");
  await queryRunner.query("DELETE FROM autenticacao");
  await queryRunner.query("DELETE FROM usuario");
  await queryRunner.query("DELETE FROM conta");
  await queryRunner.release();
  });

  it("Deve criar uma transação com sucesso e atualizar os saldos", async () => {
    const valorTransferencia = 150.50;
    const token = await JwtCreate(String(usuarioOrigem.id)); 

    const payload = {
      chave_origem: chaveOrigem.chave,
      chave_destino: chaveDestino.chave,
      valor: valorTransferencia,
      mensagem: "Teste de transferência",
    };

    const response = await supertest(app)
      .post("/v1/transacoes")
      .set("Authorization", `Bearer ${token}`) // Adiciona o token de autenticação
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.valor).toBe(valorTransferencia);

    const contaRepo = pixDs.getRepository(Conta);
    const contaOrigemAtualizada = await contaRepo.findOneBy({ id: contaOrigem.id });
    const contaDestinoAtualizada = await contaRepo.findOneBy({ id: contaDestino.id });

    expect(Number(contaOrigemAtualizada?.saldo)).toBe(1000 - valorTransferencia); // 849.5
    expect(Number(contaDestinoAtualizada?.saldo)).toBe(500 + valorTransferencia); // 650.5
  });

  it("Deve retornar status code 400", async () => {
    const token = await JwtCreate(String(usuarioOrigem.id));
    const payload = {
      chave_origem: chaveOrigem.chave,
      chave_destino: chaveDestino.chave,
      valor: 2000, 
    };

    const response = await supertest(app)
      .post("/v1/transacoes")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    expect(response.status).toBe(400); 
    
  });
});