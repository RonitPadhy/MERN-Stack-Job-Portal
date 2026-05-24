import UserController from "../controllers/user.controller.js";
import express from "express";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

//REGISTER THE USER :-
router.post("/register", verifyToken, UserController.Register);

// LOGIN THE USER:-
router.post("/login", verifyToken, UserController.login);

// LOGOUT THE USER:-
router.get("/logout", verifyToken, UserController.logout);

//UPDATE THE USER:-
router.patch("/update", verifyToken, UserController.updateProfile);

export default router;
