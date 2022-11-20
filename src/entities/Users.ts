import { Entity, PrimaryGeneratedColumn, Column,OneToOne, ManyToMany, JoinColumn, JoinTable } from "typeorm";
import { Length, Matches } from "class-validator";
import * as bcrypt from "bcryptjs";
import {Account} from "./Accounts";
import { Transaction } from "./Transactions"; 

@Entity("user")
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true})
    @Length(3)
    username: string

    @Column()
    @Length(8)
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, {message: "password must contain a number and an uppercase letter."})
    password: string

    @OneToOne(()=> Account)
    @JoinColumn()
    account: Number

    @ManyToMany(() => Transaction, transaction => transaction.user)
    @JoinTable({
        name: "transaction_user",
        joinColumn:{
            name: "transaction_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn:{
            name: "id",
            referencedColumnName: "id",
        },
    })
    transaction : Transaction[]

    hashPassword(){
        return this.password = bcrypt.hashSync(this.password, 8)
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}