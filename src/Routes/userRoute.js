const userController = require("../Controllers/userController");
const USERS_ROUTE_BASE_URL = process.env.USERS_ROUTE_BASE_URL;
require("dotenv").config();

console.log("USERS_ROUTE_BASE_URL --->", USERS_ROUTE_BASE_URL);

module.exports = (app) => {
  app.post(
    "/" + USERS_ROUTE_BASE_URL + "/registration",
    userController.registration
  );
  app.post("/" + USERS_ROUTE_BASE_URL + "/login", userController.login);
  app.post(
    "/" + USERS_ROUTE_BASE_URL + "/resetPassword",
    userController.resetPassword
  );
};
