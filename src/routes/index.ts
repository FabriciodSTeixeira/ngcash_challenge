import {Router, Request, Response} from "express";
import user from "./user";
import login from "./auth";

const routes = Router();

routes.get('/', (req:Request, res:Response)=>{
    return res.json("API Working")
})

routes.use(user);
routes.use(login);

export default routes;