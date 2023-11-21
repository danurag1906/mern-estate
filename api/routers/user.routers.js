import express from "express";
import {
  deleteUser,
  test,
  updateUser,
  getUserListings,
  getUser,
} from "../controllers/user.controllers.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verifyToken, updateUser); //before updating we need to check if the user is authenticated or not. So there is an extra check. We will use the token inside the cookie toverify the user.
router.delete("/delete/:id", verifyToken, deleteUser); //same as update user
router.get("/listings/:id", verifyToken, getUserListings);
router.get("/:id", verifyToken, getUser); //we will use this to verify if a user is logged and then we will give the user permission to send mail as a message to landlord

export default router;
