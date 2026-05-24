import UserController from "../controllers/user.controller.js";
import express from "express";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

//REGISTER THE USER :-
router.post("/register", UserController.Register);

// LOGIN THE USER:-
router.post("/login", UserController.login);

// LOGOUT THE USER:-
router.get("/logout", verifyToken, UserController.logout);

//UPDATE THE USER:-
router.post("/update", verifyToken, UserController.updateProfile);

export default router;
