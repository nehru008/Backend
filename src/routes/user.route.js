import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"; // import multer middleware
import { LoginUser, LogOutUser, RegisterUser } from "../controllers/users.controllers.js";
import VerifyJWT from "../middlewares/auth.middleware.js";



const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",      // field name from frontend form
            maxCount: 1
        },
        {
            name: "coverImage",  // field name from frontend form
            maxCount: 1
        }
    ]),
    RegisterUser
);


router.route("/login").post(LoginUser)
// secured routes
router.route("/logout").post(verifyJWT,LogOutUser)

export default router;