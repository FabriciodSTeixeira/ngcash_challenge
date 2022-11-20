import { transactionRepository } from './../repositories/transactionRepository';
import { accountRepository } from './../repositories/accountRepository';
import {validate} from "class-validator";
import { Request, Response } from "express";
import { User } from "../entities/Users";
import { userRepository } from "../repositories/userRepository";
import { stringify } from "querystring";
import { Account } from "../entities/Accounts";
import jwt from 'jsonwebtoken';
import { Transaction } from '../entities/Transactions';


export class UserController {
    static async createUser(req:Request, res:Response){
        let {username, password} = req.body;

        // try {
        //     JSON.parse(req.body)
        // } catch (error) {
        //     return res.status(404).send(error)
        // }

        

        let user : User = new User();

        try {
            user.username = username;
            user.password = password;

            const validationErrors = await validate(user)
            if(validationErrors.length >0){
                return res.status(400).send(validationErrors);
            };

            user.hashPassword();

            let newAccount : Account = new Account();
            newAccount.balance = 100;

            user.account = newAccount.id;

            try{
               await accountRepository.save(newAccount);
               await userRepository.save(user);
            }catch(error){
               return res.status(400).send(error);
            };

            return res.status(201).send("User Created");

            } catch (error) {
                return res.status(400).send(error)
            }
    };

    static async cashOut(req:Request, res:Response){
        const token = <any>req.header("Authorization")?.replace("Bearer ", "")
        if(!token){
            return res.status(401).send("User not logged.")
        };
        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET??'');
        } catch (error) {
            return res.status(400).send(error);
        }

        let {id} : any = payload;

        const {value} = req.body;

        
        

        let user = await userRepository.findOneOrFail({where:{id: Number(id)}})
        
        let cashOutTransaction : Transaction = new Transaction();
        let accountNewBalance : number;

        let account = await accountRepository.findOneOrFail({where:{id:Number(user.account)}})

        try {
            if (account.balance >= value){
                accountNewBalance = account.balance - value
                return account.balance = accountNewBalance
            };
            cashOutTransaction.debitedAcountId = Number(user.account);
            cashOutTransaction.value = value;

            await transactionRepository.save(cashOutTransaction);
            await accountRepository.save(account);

        } catch (error) {
            return res.status(400).send({message: "Erro aqui try catch do bn"})
        }

        return res.status(200).send("Cash out succesfull");

    };
};