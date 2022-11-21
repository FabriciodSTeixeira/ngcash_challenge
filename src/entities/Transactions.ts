import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("transaction")
export class Transaction{

    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable:true})
    debitedAccountId ?: number 

    @Column({nullable:true})
    creditedAccountId ?: number 

    @Column()
    value : number

    @Column()
    @CreateDateColumn()
    createdAt: Date

};