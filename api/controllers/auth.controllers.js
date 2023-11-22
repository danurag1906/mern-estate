import User from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json("New User created successfully!");
  } catch (error) {
    next(error); //this error will be send to the index.js via next() function and the error will be displayed there
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //check if there is an user with the given email address
    const validUser = await User.findOne({ email });

    //if its not present throw a custom error indicating 'user not found'
    if (!validUser) {
      return next(errorHandler(404, "User not found!"));
    }

    //now check if the credentials are correct
    //compatre password from client side with the one with database document
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Wrong Credentials!"));
    }

    //now if everything is correct we will save user detaisl in the cookies by hashing it

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    //we dont to send the user password in the res json. so we remove password and send rest of the information to the response in json
    const { password: pass, ...restData } = validUser._doc;

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(restData);
  } catch (error) {
    next(error); //pass the error to the middlware and then to index.js
  }
};

export const google = async (req, res, next) => {
  try {
    //first find if user already exist in the data base.
    const user = await User.findOne({ email: req.body.email });

    //if user exists then register the user and save in cookies else create a new user
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc; //dont save password in the cookies
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8); //generate a password of length 16

      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      // now create a new user in the database with unique username

      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });

      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};
