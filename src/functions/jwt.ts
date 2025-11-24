import { pixDs } from "../data-source";
import { Autenticacao } from "../entities/autenticacao.entity";

const authRepo = pixDs.getRepository(Autenticacao)
export const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function JwtCreate(id: string) {
    const { SignJWT } = await import("jose");
    try {
    const a = await new SignJWT({ id }).setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("5m")
        .sign(secret);

    return a
} catch (e) {
}
}

export async function JwtVerify(token: string) {
    const { jwtVerify } = await import("jose");
    return await jwtVerify(token, secret)
}

export async function JwtVerifyAuth(tk: string) {
    if (!tk) return false;

    const tokenSplit = tk.includes("Bearer") ?  tk.split(" ")[1] : tk

    const [header, payload, signature] = tokenSplit.split(".");

    const payloadDecoded = JSON.parse(Buffer.from(payload, "base64").toString("utf8"))


    const existisInAuth = await authRepo.findOne({
    where: { usuario: { id: payloadDecoded.id } },
    relations: ["usuario"],
    });


    const findBlackList = await pixDs.query("SELECT token FROM AUTENTICACAO_BLACK_LIST WHERE token = $1",[tokenSplit])
  
    const useToken = existisInAuth?.token || tokenSplit

    if (findBlackList.length > 0 || existisInAuth?.token === null) {
        return false
    }

    try {
        await JwtVerify(useToken)
        return true

    } catch (e: any) {
        if (e?.code === "ERR_JWT_EXPIRED" || e?.message?.includes("JWTExpired")) {
            const newTokenCath = await JwtCreate(String(existisInAuth?.usuario.id))
            await authRepo.update(existisInAuth?.id ?? 0, { token: newTokenCath })

            return true
        }

        return false
    }
}



