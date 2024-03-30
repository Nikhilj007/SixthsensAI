import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import { createRequest,updateRequest,deleteRequest, getRequests, addApproval, login,  addComment, getAllUsers, signup } from "./controller.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Login API
app.post("/login", login);
app.post('/signup', signup);
app.get("/getusers",getAllUsers);

// CRUD API for pull requests
app.get("/pull-requests", getRequests);  
app.get("/pull-requests/:id", getRequests);
app.post("/pull-requests",createRequest);
app.patch("/pull-requests/:id",updateRequest);
app.delete("/pull-requests/:id",deleteRequest); 

// CRUD API for comments
app.post("/pull-requests/comments", addComment);


// CRUD API for approvals
app.post("/approvals",addApproval);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch((error) => console.log(error.message));
