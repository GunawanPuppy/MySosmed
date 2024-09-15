const jwt = require("jsonwebtoken")

let secretb = process.env.secret


const signToken = (payload) => {
    return jwt.sign(payload,secretb)
}

const verifyToken = (token) => {
    return jwt.verify(token,secretb)
}

module.exports = {
    signToken,verifyToken
}