import { UserController } from "../controllers/UserController";
import { Router } from "express";

const router = Router();

router
    .route("/user")
    .post(UserController.createUser)

export default router;