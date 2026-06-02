import CompanyController from "../controllers/company.controller.js";
import verifyToken from "../middlewares/verifyToken.js";
import express from "express";

const router = express.Router();

//Register the company
router.post("/register",verifyToken , CompanyController.registerCompany);

//get all the registered company for user
router.get("/get-registered", verifyToken , CompanyController.getRegisteredComapany);

router.get("/:companyId",verifyToken , CompanyController.getCompanyById);

// Update the profile
router.patch("/update-company/:companyId", verifyToken,  CompanyController.updateCompany);

export default router;
