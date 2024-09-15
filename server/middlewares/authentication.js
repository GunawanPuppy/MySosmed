
const { database } = require("../config/mongodb");
const { verifyToken } = require("../helpers/jwt");
const { ObjectId } = require("mongodb");

async function authentication(req) {
  try {
    //cek ada di headers dengan key authorization gak?
    if (!req.headers.authorization) {
      throw new Error("Please login first!");
    }

    const token = req.headers.authorization.split(" ")[1];
    // console.log(token, "ini token");

    //verifikasi tokennya  bener gak? keluarannya id
    const payload = verifyToken(token);
    // console.log(payload, "ini payload");

    //samain bentuk _id dengan yang ada di database
    // const userId = new ObjectId(payload._id);

    const findUser = await database
      .collection("users")
      .findOne({ _id: new ObjectId(payload._id) });
    // console.log(findUser, "ini findUser");
    if (!findUser) {
      throw new Error("Invalid Token");
    }
    // console.log(findUser, "ini findUser");

    return {
      userId: findUser._id,
      username: findUser.username,
    };
  } catch (error) {
    console.log(error, "ini error di authentication");
  }
}

module.exports = authentication;
