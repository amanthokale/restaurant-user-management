const apiResponse = require("../Components/apiResponse");
const {
  body,
  query,
  sanitizeBody,
  validationResult,
} = require("express-validator");
const getDb = require("../Config/db");
var ObjectID = require("mongodb").ObjectID;

module.exports.registration = [
  body("first_name")
    .isLength({ min: 1 })
    .trim()
    .withMessage("first_name must be specified"),
  body("last_name")
    .isLength({ min: 1 })
    .trim()
    .withMessage("last_name must be specified"),
  body("mobile_no").exists().withMessage("mobile_no must be specified"),
  body("password")
    .isLength({ min: 1 })
    .trim()
    .withMessage("password must be specified"),
  body("email")
    .isLength({ min: 1 })
    .trim()
    .withMessage("email must be specified"),
  body("restaurant_name")
    .isLength({ min: 1 })
    .trim()
    .withMessage("restaurant_name must be specified"),
  sanitizeBody("restaurant_name").escape(),
  async (request, response) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          response,
          "validation error",
          errors.array()
        );
      } else {
        const db = await getDb();
        const myobj = request.body;
        let userExists = await db
          .collection("users")
          .findOne({ mobile_no: myobj.mobile_no });
        if (userExists) {
          return apiResponse.successResponse(
            response,
            "Mobile number already registered"
          );
        } else {
          let insertedUser = await db
            .collection("users")
            .insertOne({ ...myobj });
          let user = await db
            .collection("users")
            .findOne({ _id: ObjectID(insertedUser.insertedId) });
          return apiResponse.successResponseWithData(response, "success", user);
        }
      }
    } catch (e) {
      console.log(e);
      return apiResponse.errorResponse(response, "Something went wrong!!");
    }
  },
];

module.exports.login = [
  body("mobile_no").exists().withMessage("mobile_no must be specified"),
  body("password")
    .isLength({ min: 1 })
    .trim()
    .withMessage("password must be specified"),
  async (request, response) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          response,
          "validation error",
          errors.array()
        );
      } else {
        const db = await getDb();
        const myobj = request.body;
        let userExists = await db
          .collection("users")
          .findOne({ mobile_no: myobj.mobile_no });
        if (userExists) {
          let checkUser = await db
            .collection("users")
            .findOne({ mobile_no: myobj.mobile_no, password: myobj.password });
          if (checkUser) {
            delete checkUser.password;
            return apiResponse.successResponseWithData(
              response,
              "login successfull",
              checkUser
            );
          } else {
            return apiResponse.successResponse(response, "invalid credentials");
          }
        } else {
          return apiResponse.successResponse(response, "user does not exists");
        }
      }
    } catch (e) {
      console.log(e);
      return apiResponse.errorResponse(response, "Something went wrong!!");
    }
  },
];

module.exports.resetPassword = [
  body("user_id").exists().withMessage("user_id must be specified"),
  body("current_password")
    .isLength({ min: 1 })
    .trim()
    .withMessage("current_password must be specified"),
  body("new_password")
    .isLength({ min: 1 })
    .trim()
    .withMessage("new_password must be specified"),
  async (request, response) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          response,
          "validation error",
          errors.array()
        );
      } else {
        const db = await getDb();
        const myobj = request.body;
        let userExists = await db
          .collection("users")
          .findOne({ _id: ObjectID(myobj.user_id) });
        if (userExists) {
          let checkUser = await db.collection("users").findOne({
            _id: ObjectID(myobj.user_id),
            password: myobj.current_password,
          });
          if (checkUser) {
            await db
              .collection("users")
              .updateOne(
                { _id: ObjectID(myobj.user_id) },
                { $set: { password: myobj.new_password } }
              );
            return apiResponse.successResponse(
              response,
              "password updated successfully"
            );
          } else {
            return apiResponse.successResponse(response, "invalid credentials");
          }
        } else {
          return apiResponse.successResponse(response, "user does not exists");
        }
      }
    } catch (e) {
      console.log(e);
      return apiResponse.errorResponse(response, "Something went wrong!!");
    }
  },
];
