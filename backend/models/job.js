import { application } from "express";
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: [
    {
      type: String,
    },
  ],
  salary: {
    type: Number,
    required: true,
  },
  experienceLevel : {
    type : Number,
    required : true
  },
  location: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    required: true,
  },
  position: {
    type: Number,
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  applications : [
    {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Application"
    }
  ]
});

const Job = mongoose.model("Job",jobSchema);

export default Job;
