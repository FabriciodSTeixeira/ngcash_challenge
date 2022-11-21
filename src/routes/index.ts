import {Router, Request, Response} from "express";
import user from "./user";
import login from "./auth";
import account from "./account";
import transaction from "./transaction";

const routes = Router();

routes.get('/', (req:Request, res:Response)=>{
    return res.json("API Working")
})

routes.use(user);
routes.use(login);
routes.use(account);
routes.use(transaction);

export default routes;