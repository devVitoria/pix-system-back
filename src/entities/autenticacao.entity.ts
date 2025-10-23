import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Usuario } from "./usuario.entity"

@Entity({
    name: "autenticacao"
})
export class Autenticacao {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    token!: string

    @OneToOne(() => Usuario, (user) => user.autenticacao, {cascade: true})
    @JoinColumn()
    usuario!: Usuario

}