import { Router } from "express";
import {RegisterUser} from "../controllers/users.controllers.js"

const router = Router()

router.route("/register").post(RegisterUser)



export default router