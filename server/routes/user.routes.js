import { Router } from "express";
import { registerUser } from "../controllers/registerUser";

const router = Router();

router.route("/register").post(registerUser);

export { router };
