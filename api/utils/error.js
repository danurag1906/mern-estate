export const errorHandler = (statusCode, message) => {
  //the status code and message are created by us to created a customized message.
  //javascript inbuilt Error module
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;
  return error;
};
