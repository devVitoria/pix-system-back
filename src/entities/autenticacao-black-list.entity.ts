import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity({
    name: "autenticacao_black_list"
})
export class AutenticacaoBlackList {

    @PrimaryColumn()
    id!: number

    @Column()
    token!: string

}