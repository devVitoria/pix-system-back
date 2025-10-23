import { Column, Entity,ManyToOne, JoinColumn, PrimaryColumn, OneToMany } from "typeorm"
import {Usuario}  from "./usuario.entity"
import { Transacao } from "./transacao.entity"

@Entity(
    {
        name: "chaves"
    }
)
export class Chave {
    @PrimaryColumn()        
    chave!: string

    @Column({
        nullable: false
    }
    )
    tipo!: string

   @ManyToOne(()=> Usuario,(usuario)=> usuario.chaves) 
   @JoinColumn({name:"usuarioId"}) 
   usuario!: Usuario 

   @OneToMany(()=> Transacao,(transacao)=> transacao.chave_origem,{cascade:true})
   transacaoOrigem!: Transacao[]

   @OneToMany(()=> Transacao,(transacao)=> transacao.chave_destino,{cascade:true})
   transacaoDestino!: Transacao[]
}
