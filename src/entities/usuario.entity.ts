import { Column, Entity, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn } from "typeorm"
import { Autenticacao } from "./autenticacao.entity"
import { Chave } from "./chave.entity"
import { Conta } from "./conta.entity"

@Entity({
    name: "usuario"
})
export class Usuario {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({ nullable: false, unique: true})
    cpfcnpj!: string

    @Column({ nullable: false })
    nome!: string

    @Column({ nullable: false })
    telefone!: string

    @Column({ nullable: false })
    rua!: string

    @Column({ nullable: false })
    bairro!: string

    @Column({ nullable: false })
    cidade!: string

    @Column({ nullable: false})
    email!: string

    @Column({ nullable: false})
    password!: string

    @OneToOne(() => Conta, (conta) => conta.usuario, {cascade: true})
    @JoinColumn()
    conta!: Conta

    
    @OneToMany(() => Chave, (chave) => chave.usuario)
    chaves!: Chave[]

    @OneToOne(() => Autenticacao, (aut) => aut.usuario)
    autenticacao!: Autenticacao
}