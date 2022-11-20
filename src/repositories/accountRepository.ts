import { Account } from './../entities/Accounts';
import { AppDataSource } from "../database/datasource";

export const accountRepository = AppDataSource.getRepository(Account);