import { Column, Entity, PrimaryGeneratedColumn, OneToOne } from "typeorm"
import { Usuario } from "./usuario.entity"

@Entity({
    name: "conta"
})
export class Conta {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({ nullable: false, unique: true})
    nroConta!: number

    @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false, default: 0 })
    saldo!: number

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dataCriacao!: Date

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    dataUltimaMovimentacao!: Date

    @OneToOne(() => Usuario, (usuario) => usuario.conta)
    usuario!: Usuario
}