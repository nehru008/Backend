
import asyncHandler from "../utils/asyncHandler.js"
const RegisterUser = asyncHandler(async (req, res) => {
    res.status(201).json({
        message: "ok"
    });
});

export {RegisterUser}