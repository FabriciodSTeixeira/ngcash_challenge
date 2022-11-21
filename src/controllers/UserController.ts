import { accountRepository } from './../repositories/accountRepository';
import {validate} from "class-validator";
import { Request, Response } from "express";
import { User } from "../entities/Users";
import { userRepository } from "../repositories/userRepository";
import { Account } from "../entities/Accounts";


export class UserController {
    static async createUser(req:Request, res:Response){

        let {username, password} = req.body;

        let user : User = new User();

        if(typeof password != "string" || typeof username != "string"){
            return res.status(404).send("Invalid type of parameters on request")
        }

        try {
            user.username = username;
            user.password = password;

            const validationErrors = await validate(user)
            if(validationErrors.length >0){
                return res.status(400).send(validationErrors);
            };

            user.hashPassword();

            let newAccount : Account = new Account();

            user.account = newAccount;

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
};