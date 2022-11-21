import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("account")
export class Account{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    private balance : number = 100

    getBalance(): number{
        return this.balance;
    };

    withDraw(value:number, balance : number):number{
        if(value>0 || value <= balance){
            this.balance -= value;
            return this.balance;
        }
        return 0;
    };

    deposit(value:number):number{
        if(value > 0){
            this.balance += value;
            return this.getBalance();
        };
        return 0;
    };

    transfer(userAccountToBeDebbited : Account, userAccountToBeCredited: Account, value: number){
            userAccountToBeDebbited.withDraw(value,userAccountToBeDebbited.getBalance());
            userAccountToBeCredited.deposit(value);
    }
}