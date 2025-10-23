import { pixDs } from "../data-source";
import { Autenticacao } from "../entities/autenticacao.entity";

const authRepo = pixDs.getRepository(Autenticacao)
export const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function JwtCreate(id: string) {
    const { SignJWT } = await import("jose");
    console.log("entrouuu")
    try {
    const a = await new SignJWT({ id }).setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("20m")
        .sign(secret);

    console.log("AAAA", a)
    return a
} catch (e) {
console.log("DEUUU ERRO NESSE CARAIII", e)
}
}

export async function JwtVerify(token: string) {
    const { jwtVerify } = await import("jose");
    return await jwtVerify(token, secret)
}

export async function JwtVerifyAuth(tk: string) {
    if (!tk) return false;
    const tokenSplit = tk.includes("Bearer") ?  tk.split(" ")[1] : tk
    const existsUser = await authRepo.findOne({
        where: { token: tokenSplit },
        relations: ["usuario"],
    });
    const findBlackList = await pixDs.query("SELECT token FROM AUTENTICACAO_BLACK_LIST WHERE token = $1",[tokenSplit])
    if (!existsUser || findBlackList.length > 0) {
        return false
    }
    const useToken = existsUser?.token || tk
    if (!useToken ||findBlackList.length > 0 ) {
        const newToken = await JwtCreate(String(existsUser.usuario.id))
        await authRepo.update(existsUser?.id ?? 0, { token: newToken })
        return true
    }

    try {
        const verifia = await JwtVerify(useToken)
        return true

    } catch (e: any) {
        if (e?.code === "ERR_JWT_EXPIRED" || e?.message?.includes("JWTExpired")) {
            const newTokenCath = await JwtCreate(String(existsUser?.usuario.id))
            await authRepo.update(existsUser?.id ?? 0, { ...existsUser, token: newTokenCath })

            return true
        }

        return false
    }
}



