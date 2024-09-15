const { database } = require("../config/mongodb");
const { ObjectId } = require("mongodb");

class User {
  static async register(newUser) {
    const users = database.collection("users");

    const result = await users.insertOne(newUser);
    return result;
  }

  static async login(email) {
    const users = database.collection("users");
    const result = await users.findOne({ email });
    return result;
  }

  static async findByUsername(username) {
    const users = database.collection("users");
    const result = await users.findOne({ username})
    return result
  }

  static async findById(_id) {
    const users = database.collection("users");
    const UserId = new ObjectId(_id);
    const result = await users.findOne(UserId);
    // console.log(result,"ini result di schema")
    return result;
  }
}

module.exports = User;
