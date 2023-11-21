import Listing from "../models/listing.models.js";
import User from "../models/user.models.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
  res.json({
    message: "hello world ! ",
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    //req.user is comming from /utils/verifyUser file || verifyToken method and the req.params is comming from user.routers.js file
    return next(errorHandler(401, "You can only update your own account"));
  }
  //if everything is fine we will update the user
  try {
    if (req.body.password) {
      //if new password is entered , then encrypt that password before updating
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          //we will use this set method to update the input fields which are actually changes by user , else if any of the input fields are not changed those values will be ignored
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    //see comments same as above
    return next(errorHandler(401, "You can only delete your own account!"));
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token"); //clear the token to remove the user
    res.status(200).json("User deleted successfully!");
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    //if the user is a valid user then only show his listings
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      //id is coming as query parameter in the api call. fetch all the listings related to that id
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your own listings!"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(errorHandler(404, "User not found!"));
    }

    //we will send the user doc to client without the password details
    const { password: pass, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
