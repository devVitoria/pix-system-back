import {Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "typeorm";
import { Chave } from "./chave.entity";


@Entity({
    name: "transacoes"
})
export class Transacao{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        nullable : false
    })
    data_transferencia!: string;

    @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
    valor!: number;
  @Column({
        nullable: true
    })
    mensagem!: string;

    @ManyToOne(()=>Chave,(chave)=> chave.chave )
    @JoinColumn({name: "fk_transacoes_chave_origem"})
    chave_origem!: Chave 

        
    @ManyToOne(()=>Chave,(chave)=> chave.chave )
    @JoinColumn({name: "fk_transacoes_chave_destino"})
    chave_destino!: Chave
    transacao!: { chave: any; };
}