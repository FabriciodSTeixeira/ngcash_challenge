import { UserController } from "../controllers/UserController";
import { Router } from "express";
import { checkJwt } from "../middlewares/checkJWT";

const router = Router();

router
    .route("/user")
    .post(UserController.createUser)
    .put([checkJwt], UserController.cashOut);

export default router;