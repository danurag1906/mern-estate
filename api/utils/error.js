export const errorHandler = (statusCode, message) => {
  //javascript inbuilt Error module
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;
  return error;
};
