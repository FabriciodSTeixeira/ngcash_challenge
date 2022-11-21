import { transactionRepository } from './../repositories/transactionRepository';
import { accountRepository } from './../repositories/accountRepository';
import { Request, Response } from "express";
import { User } from "../entities/Users";
import { userRepository } from "../repositories/userRepository";
import { Account } from "../entities/Accounts";
import jwt from 'jsonwebtoken';

export class TransactionController {
    static async getAllTransactions(req: Request, res: Response) {
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

        let user: User = await userRepository.findOneOrFail({ where: { id: Number(id) } });
        let userAccount: Account = await accountRepository.findOneOrFail({ where: { id: user.id } });

        let transactions;

        try {
            transactions = await transactionRepository
                .createQueryBuilder("transaction")
                .having('transaction.debitedAccountId = :userAccount', { userAccount: userAccount.id })
                .orHaving('transaction.creditedAccountId = :userAccount', { userAccount: userAccount.id })
                .groupBy("transaction.debitedAccountId")
                .addGroupBy("transaction.creditedAccountId")
                .addGroupBy("transaction.id")
                .addGroupBy("transaction.value")
                .addGroupBy("transaction.createdAt")
                .orderBy("transaction.id", "ASC")
                .getRawMany();
        } catch (error) {
            return res.status(400).send(error);
        }

        try {
            return res.status(200).json(transactions);
        } catch (error) {
            return res.status(400).send(error);
        }
    };

    static async cashOutTransactions(req: Request, res: Response) {
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

        let user: User = await userRepository.findOneOrFail({ where: { id: Number(id) } });
        let userAccount: Account = await accountRepository.findOneOrFail({ where: { id: user.id } });

        let transactions;

        try {
            transactions = await transactionRepository
                .createQueryBuilder("transaction")
                .where('transaction.debitedAccountId = :userAccount', { userAccount: userAccount.id })
                .orderBy("transaction.id", "ASC")
                .getRawMany();
        } catch (error) {
            return res.status(400).send(error);
        }

        try {
            return res.status(200).json(transactions);
        } catch (error) {
            return res.status(400).send(error);
        }
    };

    static async cashInTransactions(req: Request, res: Response) {
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

        let user: User = await userRepository.findOneOrFail({ where: { id: Number(id) } });
        let userAccount: Account = await accountRepository.findOneOrFail({ where: { id: user.id } });

        let transactions;

        try {
            transactions = await transactionRepository
                .createQueryBuilder("transaction")
                .where('transaction.creditedAccountId = :userAccount', { userAccount: userAccount.id })
                .orderBy("transaction.id", "ASC")
                .getRawMany();
        } catch (error) {
            return res.status(400).send(error);
        }

        try {
            return res.status(200).json(transactions);
        } catch (error) {
            return res.status(400).send(error);
        }
    };
}