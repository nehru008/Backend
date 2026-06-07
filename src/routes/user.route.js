import { Router } from "express";
import { RegisterUser } from "../controllers/users.controllers.js";
import { upload } from "../middlewares/multer.middleware.js"; // import multer middleware

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

export default router;