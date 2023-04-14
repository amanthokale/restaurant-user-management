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
