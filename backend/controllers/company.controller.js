import Company from "../models/company.js";

class CompanyController {
  static async registerCompany(req, res) {
    try {
      const { companyName } = req.body;
      if (!companyName) {
        return res
          .status(400)
          .json({ message: "please provide the company name", success: false });
      }

      let company = await Company.findOne({ companyName });
      if (company) {
        return res.status(401).json({
          success: false,
          message: "Register with a different company",
        });
      }

      company = await Company.create({
        name: companyName,
        userId: req.id,
      });

      return res.status(201).json({
        message: "Company successfully registered",
        success: true,
        company,
      });
    } catch (err) {
      console.log("Error :-", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getRegisteredComapany(req, res) {
    try {
      const userId = req.id; //Logged in User
      const companies = await Company.find({ userId });

      if (!companies) {
        return res
          .status(404)
          .json({ message: "Companies not found", success: "false" });
      }

      return res.status(200).json({
        success: true,
        message: "Companies fetched successfully",
        companies,
      });
    } catch (err) {
      console.log("Error:-", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getCompanyById(req, res) {
    try {
      const { companyId } = req.params;
      if (!companyId) {
        return res
          .status(400)
          .json({ message: "CompanyId is required", success: false });
      }

      const company = await Company.findById(companyId);
      if (!company) {
        return res
          .status(404)
          .json({ message: "Company not found", success: false });
      }

      return res.status(200).json({
        message: "Company fetched Successfully",
        success: true,
        company,
      });
    } catch (err) {
      console.log("Error:-", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async updateCompany(req, res) {
    try {
      const { name, description, website, location } = req.body;

      const updatedData = { name, description, website, location };
      const file = req.file;
      const { companyId } = req.params;
      if (!companyId) {
        return res
          .status(400)
          .json({ message: "Please provide the company id" });
      }

      let company = await Company.findById(companyId);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      company = await Company.findByIdAndUpdate(companyId, updatedData, {
        new: true,
      });

      return res
        .status(200)
        .json({
          message: "Company  information updated",
          success: true,
          company,
        });
    } catch (err) {
      console.log("Error:-", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default CompanyController;
