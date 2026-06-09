import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"; // import multer middleware
import { LoginUser, 
        LogOutUser, 
        RegisterUser , 
        RefreshAccessToken ,
        ChangeCurrentPassword, 
        getCurrentUser, 
        UpdateUserAvatar, 
        UpdateUserCoverImage, 
        getUserCurrentProfile, 
        getWatchHistory, 
        updatedAccountDetails
} from "../controllers/users.controllers.js";
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
router.route("/logout").post(VerifyJWT,LogOutUser)
router.route("refresh-token").post(RefreshAccessToken)
router.route("/change-password").post(VerifyJWT, ChangeCurrentPassword)
router.route("/current-user").get(VerifyJWT, getCurrentUser)
router.route("/update-account").patch(VerifyJWT, updatedAccountDetails)

router.route("/avatar").patch(VerifyJWT, upload.single("avatar"), UpdateUserAvatar)
router.route("/cover-image").patch(VerifyJWT, upload.single("coverImage"), UpdateUserCoverImage)

router.route("/c/:username").get(VerifyJWT, getUserCurrentProfile)
router.route("/history").get(VerifyJWT, getWatchHistory)

export default router;