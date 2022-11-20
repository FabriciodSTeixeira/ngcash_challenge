import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("account")
export class Account{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    balance : number
}