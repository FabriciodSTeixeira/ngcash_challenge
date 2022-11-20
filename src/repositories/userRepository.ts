import { AppDataSource } from "../database/datasource";
import { User } from "../entities/Users";


export const userRepository = AppDataSource.getRepository(User);