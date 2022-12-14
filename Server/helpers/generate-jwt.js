const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

// Generate a new JWT
const generateJWT = (uid = "") => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    jwt.sign(
      payload,
      process.env.PRIVATEKEY,
      {
        expiresIn: "7D",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("Could not generate token");
        } else {
          resolve(token);
        }
      }
    );
  });
};

// Validate JWT
const checkJTW = async (token = "") => {
  try {
    if (token.length <= 10) {
      return null;
    }

    const { uid } = await jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const user = await User.findById(uid);

    if (user) {
      if (user.status) {
        return user;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateJWT,
  checkJTW,
};
