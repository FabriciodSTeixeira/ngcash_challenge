import { Transaction } from './../entities/Transactions';
import { AppDataSource } from "../database/datasource";

export const transactionRepository = AppDataSource.getRepository(Transaction);