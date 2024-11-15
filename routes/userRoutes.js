const { Router } = require("express");
const userController = require("../controllers/userController")
const userRouter = Router();
const { body } = require('express-validator');

userRouter.get("/", userController.usersGet);
userRouter.get("/sign-up", userController.usersSignupGet);
userRouter.post("/sign-up", 
    body('first_name').trim().notEmpty().withMessage("First name is required").isAlpha().withMessage("First name must only contain letters"),
    body('last_name').trim().notEmpty().withMessage("Last name is required").isAlpha().withMessage("Last name must only contain letters"),
    body('username').trim().notEmpty().withMessage("Username is required").isLength({min: 5}).withMessage("Username must be at least 5 characters long"),
    body('password').trim().notEmpty().withMessage("Password is required").isLength({min: 6}).withMessage("Password must be at least 5 characters long"),
    body('confirm_password').custom((value, { req }) => {
        return value === req.body.password;
    }),
    userController.usersSignupPost);
userRouter.get("/join/:username", userController.usersJoinTheClubGet);
userRouter.post("/join/:username",
    body('secret_key').trim().notEmpty().withMessage("Secret Key is required to become a member").custom((value) => {
        if (value !== "hello") {
            throw new Error("Invalid Secret Key");
        }
        return true; 
    }),
    userController.usersJoinTheClubPost);

module.exports = userRouter;