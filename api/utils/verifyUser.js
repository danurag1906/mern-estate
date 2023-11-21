import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return next(errorHandler(401, "unauthorized user")); //if there is no token verification dont let user to make updates and throw and error

  //else verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, "Forbidden")); //if there is an error in token verification throw a error mentioning user not verified to make updates

    req.user = user; //this req.user will be used in the updateUser method in user.controllers.js file
    next(); // this function means the program control will go to the next function in user.routers.js i.e updateUser.
  });
};
