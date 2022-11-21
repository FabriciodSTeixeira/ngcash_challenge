import { transactionRepository } from './../repositories/transactionRepository';
import { accountRepository } from './../repositories/accountRepository';
import { Request, Response } from "express";
import { User } from "../entities/Users";
import { userRepository } from "../repositories/userRepository";
import { Account } from "../entities/Accounts";
import jwt from 'jsonwebtoken';
import { Transaction } from '../entities/Transactions';


export class AccountController {

    static async cashOut(req: Request, res: Response) {
        const token = <any>req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            return res.status(401).send("User not logged.")
        };
        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET ?? '');
        } catch (error) {
            return res.status(400).send(error);
        };

        let { id }: any = payload;

        const { value } = req.body;

        if(typeof value != "number"){
            return res.status(404).send("Invalid type of parameters on request")
        }

        let user : User = await userRepository.findOneOrFail({ where: { id: Number(id) } });

        let userAccount : Account = await accountRepository.findOneOrFail({ where: { id: user.id } });

        if(!(userAccount)){
            return res.status(404).send({message:"Accounts not found"});
        };
        try {

            if( value > userAccount.getBalance()){
                return res.status(400).json({message: "Not enough Balance"})
            };
            userAccount.withDraw(value, userAccount.getBalance());

            let transaction: Transaction = await transactionRepository.create({
                value: value,
                debitedAccountId: userAccount.id
            })
            await transactionRepository.save(transaction);
            await accountRepository.save(userAccount);
            return res.status(200).send("Withdraw succesfull");
        } catch (error) {
            return res.status(400).send(error)
        }

    };

    static async viewBalance(req: Request, res: Response) {
        const token = <any>req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            return res.status(401).send("User not logged.")
        };
        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET ?? '');
        } catch (error) {
            return res.status(400).send(error);
        };

        let { id }: any = payload;
        let user : User = await userRepository.findOneOrFail({ where: { id: Number(id) } });
        let userAccount : Account = await accountRepository.findOneOrFail({ where: { id: user.id } });

        if(userAccount){
            try {
                let balance : number = userAccount.getBalance();
                return res.status(200).json({message: `Your balance is ${balance}`, balance: balance});
            } catch (error) {
                return res.status(404).send("User Not Found.")
            };
        }else{
            return res.status(404).send({message:"User Not Found"})
        };
    };

    static async transfer(req: Request, res: Response) {
        const token = <any>req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            return res.status(401).send("User not logged.")
        };
        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET ?? '');
        } catch (error) {
            return res.status(400).send(error);
        };

        let { id }: any = payload;

        const { value, accountToBeCredited }:{value:number, accountToBeCredited:string} = req.body;

        if(typeof value != "number" || typeof accountToBeCredited != "string"){
            return res.status(404).send("Invalid type of parameters on request")
        }

        let userToBeDebbited : User = await userRepository.findOneOrFail({ where: { id: Number(id) } });
        let userToBeDCredited : User = await userRepository.findOneOrFail({where: {username: accountToBeCredited}});

        let userAccountToBeDebbited : Account = await accountRepository.findOneOrFail({where: { id: userToBeDebbited.id}});
        let userAccountToBeCredited : Account = await accountRepository.findOneOrFail({where: { id: userToBeDCredited.id}});

        if(!(userAccountToBeCredited || userAccountToBeDebbited)){
            return res.status(404).send({message:"Accounts not found"});
        };

        if( value > userAccountToBeDebbited.getBalance()){
            return res.status(400).json({message: "Not enough Balance"})
        };

        if (userAccountToBeDebbited.id === userAccountToBeCredited.id){
            return res.status(400).json({message: "Invalid Account."})
        }

        try {
            userAccountToBeDebbited.transfer(userAccountToBeDebbited,userAccountToBeCredited, value);

            let transaction: Transaction = await transactionRepository.create({
                value: value,
                creditedAccountId: userAccountToBeCredited.id,
                debitedAccountId: userAccountToBeDebbited.id
            });

            await transactionRepository.save(transaction);
            await accountRepository.save(userAccountToBeDebbited);
            await accountRepository.save(userAccountToBeCredited);

            return res.status(200).send({message:"Transfer made."})
        } catch (error) {
            return res.status(400).send(error);
        }
    };

    static async deposit(req: Request, res: Response) {
        const token = <any>req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            return res.status(401).send("User not logged.")
        };
        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET ?? '');
        } catch (error) {
            return res.status(400).send(error);
        };

        let { id }: any = payload;

        const { value } = req.body;

        if(typeof value != "number"){
            return res.status(404).send("Invalid type of parameters on request")
        }

        let user : User = await userRepository.findOneOrFail({ where: { id: Number(id) } });

        let userAccount : Account = await accountRepository.findOneOrFail({ where: { id: user.id } });

        if(!(userAccount)){
            return res.status(404).send({message:"Accounts not found"});
        };
        try {
            userAccount.deposit(value);

            let transaction: Transaction = await transactionRepository.create({
                value: value,
                creditedAccountId: userAccount.id
            });

            await transactionRepository.save(transaction);
            await accountRepository.save(userAccount);
            return res.status(200).send("Deposit succesfull");
        } catch (error) {
            return res.status(400).send(error);
        };

    };

};