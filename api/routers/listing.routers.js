import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
  addToWishlist,
  getWishlistItems,
  removeFromWishlist,
} from "../controllers/listing.controllers.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.post("/update/:id", verifyToken, updateListing);
router.get("/getListing/:id", getListing); // we are not verifying user here because we want to display the lsitings publically also
router.get("/getListings", getListings);
router.post("/addToWishlist/:id", verifyToken, addToWishlist);
router.get("/myWishlist", verifyToken, getWishlistItems);
router.delete("/removeFromWishlist/:id", verifyToken, removeFromWishlist);

export default router;
