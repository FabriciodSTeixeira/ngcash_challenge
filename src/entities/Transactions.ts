import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany } from "typeorm";
import { User } from "./Users";

@Entity("transaction")
export class Transaction{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    debitedAcountId : number

    @Column()
    creditedAcountId : number

    @Column()
    value : number

    @Column()
    @CreateDateColumn()
    createdAt: Date

    @ManyToMany(()=> User, user => user.transaction)
    user: User[]
};