import { User } from "../entities/Users";
import { userRepository } from "../repositories/userRepository";
import * as jwt from "jsonwebtoken";
import { Request, Response } from "express";

export class AuthController{
    static async login(req: Request, res: Response) {
    let {username, password} = req.body;
    
    // if(typeof password && username != "string"){
    //     return res.status(404).send("Invalid type of parameters on request")
    // }
    
    let user:User;
    
    try {
        user = await userRepository.findOneOrFail({where:{username}});
    } catch (error) {
        return res.status(404).send("User not found!");
    };
    if(!user.checkIfUnencryptedPasswordIsValid(password)){
        return res.status(401).send("User/Passwod Invalid");
    };

    const token = jwt.sign({id:user.id}, process.env.JWT_SECRET ?? '', {expiresIn: "24h"});

    const {password:_, ...userLogin} = user;

    return res.status(200).json({user:userLogin, token:token});

    };
}