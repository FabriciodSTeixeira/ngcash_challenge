import { Entity, PrimaryGeneratedColumn, Column,OneToOne, JoinColumn } from "typeorm";
import { Length, Matches } from "class-validator";
import * as bcrypt from "bcryptjs";
import {Account} from "./Accounts";

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
    @JoinColumn({
        name:"account_id",
        referencedColumnName: "id"
    },)
    account: Account

    hashPassword(){
        return this.password = bcrypt.hashSync(this.password, 8)
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }

}